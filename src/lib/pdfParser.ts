// src/lib/pdfParser.ts
import * as pdfjsLib from 'pdfjs-dist';
import { PDFScenario } from '@/types';

// Configure PDF.js worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

export const parsePDFScenario = async (file: File): Promise<PDFScenario> => {
  try {
    // Read file as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Load PDF document
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    const pageCount = pdf.numPages;
    
    // Extract text from all pages
    for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      // Combine text items with spaces
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      
      fullText += pageText + '\n\n';
    }
    
    // Get PDF metadata
    const metadata = await pdf.getMetadata();
    
    return {
      title: metadata.info?.Title || file.name.replace('.pdf', ''),
      content: fullText.trim(),
      metadata: {
        author: metadata.info?.Author || undefined,
        createdDate: metadata.info?.CreationDate 
          ? new Date(metadata.info.CreationDate) 
          : undefined,
        pageCount,
      },
    };
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF file');
  }
};

/**
 * Advanced extraction using pattern matching
 * This can be enhanced with OpenAI API for better accuracy
 */
export const extractScenarioStructure = (content: string) => {
  const lines = content.split('\n').map(line => line.trim()).filter(Boolean);
  
  // Pattern matching for common scenario structures
  const patterns = {
    title: /^(título|title|escenario|scenario):\s*(.+)/i,
    objective: /^(objetivo|objective|goal):\s*(.+)/i,
    situation: /^(situación|situation|contexto|context):\s*(.+)/i,
    deliverable: /^(entregable|deliverable|output):\s*(.+)/i,
    command: /^(comando|command):\s*`?(.+)`?/i,
    time: /(\d+)\s*(minutos?|minutes?|mins?|horas?|hours?)/i,
  };
  
  const extracted = {
    title: '',
    objectives: [] as string[],
    situation: '',
    deliverables: [] as string[],
    commands: [] as string[],
    estimatedTime: 30,
  };
  
  for (const line of lines) {
    // Extract title
    if (!extracted.title) {
      const titleMatch = line.match(patterns.title);
      if (titleMatch) {
        extracted.title = titleMatch[2].trim();
        continue;
      }
    }
    
    // Extract objectives
    const objectiveMatch = line.match(patterns.objective);
    if (objectiveMatch) {
      extracted.objectives.push(objectiveMatch[2].trim());
      continue;
    }
    
    // Extract situation
    const situationMatch = line.match(patterns.situation);
    if (situationMatch && !extracted.situation) {
      extracted.situation = situationMatch[2].trim();
      continue;
    }
    
    // Extract deliverables
    const deliverableMatch = line.match(patterns.deliverable);
    if (deliverableMatch) {
      extracted.deliverables.push(deliverableMatch[2].trim());
      continue;
    }
    
    // Extract commands (code blocks)
    const commandMatch = line.match(patterns.command);
    if (commandMatch) {
      extracted.commands.push(commandMatch[2].trim());
      continue;
    }
    
    // Extract time
    const timeMatch = line.match(patterns.time);
    if (timeMatch) {
      let time = parseInt(timeMatch[1]);
      if (timeMatch[2].toLowerCase().includes('hora') || timeMatch[2].toLowerCase().includes('hour')) {
        time *= 60;
      }
      extracted.estimatedTime = time;
    }
  }
  
  // If no title found, use first non-empty line
  if (!extracted.title && lines.length > 0) {
    extracted.title = lines[0].substring(0, 100);
  }
  
  // If no situation found, use first paragraph after title
  if (!extracted.situation) {
    const firstParagraph = lines.slice(1).find(line => line.length > 50);
    if (firstParagraph) {
      extracted.situation = firstParagraph;
    }
  }
  
  return extracted;
};

/**
 * Extract commands and their context from PDF content
 */
export const extractCommands = (content: string) => {
  const commands: Array<{
    command: string;
    context: string;
    category: string;
  }> = [];
  
  // Look for code blocks (indented or marked with backticks/quotes)
  const codeBlockRegex = /```([\s\S]*?)```|`([^`]+)`|"([^"]+)"/g;
  let match;
  
  while ((match = codeBlockRegex.exec(content)) !== null) {
    const command = (match[1] || match[2] || match[3]).trim();
    
    // Only include if it looks like a command
    if (isLikelyCommand(command)) {
      // Get surrounding context (50 chars before and after)
      const start = Math.max(0, match.index - 50);
      const end = Math.min(content.length, match.index + match[0].length + 50);
      const context = content.substring(start, end).trim();
      
      commands.push({
        command,
        context,
        category: categorizeCommand(command),
      });
    }
  }
  
  return commands;
};

/**
 * Check if a string looks like a command
 */
const isLikelyCommand = (str: string): boolean => {
  const commandPrefixes = ['ping', 'nmap', 'ssh', 'dig', 'netstat', 'ss', 'traceroute', 'curl', 'wget'];
  const lowerStr = str.toLowerCase().trim();
  
  return commandPrefixes.some(prefix => lowerStr.startsWith(prefix));
};

/**
 * Categorize command type
 */
const categorizeCommand = (command: string): string => {
  const lower = command.toLowerCase();
  
  if (lower.includes('ping') || lower.includes('traceroute')) return 'network';
  if (lower.includes('nmap') || lower.includes('scan')) return 'security';
  if (lower.includes('ssh') || lower.includes('scp')) return 'remote';
  if (lower.includes('dig') || lower.includes('nslookup')) return 'dns';
  if (lower.includes('netstat') || lower.includes('ss')) return 'system';
  if (lower.includes('grep') || lower.includes('awk')) return 'analysis';
  
  return 'general';
};

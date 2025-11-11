// src/components/resources/ResourceLibrary.tsx
'use client';

import React, { useState } from 'react';
import { ChevronDown, Layers, MapPin, BookSearch, ShieldHalf, Network, RadioTower } from 'lucide-react';

export const ResourceLibrary: React.FC = () => {
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  const toggleModule = (moduleId: string) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

  const modules = [
    {
      id: 'osi-tcp',
      icon: Layers,
      title: 'Fundamentos: Modelos OSI y TCP/IP',
      content: (
        <>
          <h4 className="font-bold text-cv-gold mb-2">¿Qué son?</h4>
          <p className="text-gray-300 mb-4">
            Son "manuales de instrucciones" conceptuales que dividen la compleja comunicación de red en
            capas. No son protocolos físicos, sino una forma de entender <strong>cómo</strong> deberían
            funcionar los protocolos.
          </p>
          <h4 className="font-bold text-cv-gold mb-2">Relevancia Operativa (CISO)</h4>
          <p className="text-gray-300">
            Usamos el Modelo OSI <strong>diariamente</strong> para aislar problemas. Si un usuario no
            puede acceder a un sitio, ¿el problema es de Capa 1 (cable), Capa 3 (enrutamiento/firewall) o
            Capa 7 (aplicación web caída)? Saber esto evita perder tiempo.
          </p>
        </>
      ),
    },
    {
      id: 'ip-subnetting',
      icon: MapPin,
      title: 'Fundamentos: IP y Subnetting',
      content: (
        <>
          <h4 className="font-bold text-cv-gold mb-2">¿Qué es?</h4>
          <p className="text-gray-300 mb-4">
            El sistema de "direcciones postales" de la red. El Subnetting es la técnica para dividir un
            gran "código postal" (red) en "barrios" más pequeños (subredes) para organizar el tráfico y
            mejorar la seguridad.
          </p>
          <h4 className="font-bold text-cv-gold mb-2">Relevancia Operativa (CISO)</h4>
          <p className="text-gray-300">
            El Subnetting es nuestra principal herramienta de <strong>segmentación de seguridad</strong>.
            Al poner a los "Invitados" en una subred (192.168.10.0/24) y a los "Servidores" en otra
            (192.168.30.0/27), podemos crear reglas de firewall para que NUNCA puedan hablar entre sí.
          </p>
        </>
      ),
    },
    {
      id: 'dns-basico',
      icon: BookSearch,
      title: 'Fundamentos: DNS',
      content: (
        <>
          <h4 className="font-bold text-cv-gold mb-2">¿Qué es?</h4>
          <p className="text-gray-300 mb-4">
            La "agenda telefónica" de Internet. Traduce nombres fáciles de recordar (cybervaltorix.com) a
            las direcciones IP que usan las máquinas.
          </p>
          <h4 className="font-bold text-cv-gold mb-2">Relevancia Operativa (CISO)</h4>
          <p className="text-gray-300">
            El DNS es un vector de ataque principal. El malware lo usa para "llamar a casa" (C2) o para
            robar datos (Tunelización de DNS). Por eso, en un SOC, <strong>monitoreamos</strong> y{' '}
            <strong>controlamos</strong> el tráfico DNS.
          </p>
        </>
      ),
    },
    {
      id: 'dns-avanzado',
      icon: ShieldHalf,
      title: 'Análisis Profundo: Amenazas DNS',
      content: (
        <>
          <h4 className="font-bold text-cv-gold mb-2">Envenenamiento de Caché DNS</h4>
          <p className="text-gray-300 mb-4">
            Un atacante engaña a un servidor DNS recursivo para que acepte una respuesta falsa. El servidor
            guarda (envenena) esta respuesta en su caché. Cualquier usuario que consulte ese servidor será
            redirigido a una IP maliciosa.
          </p>
          <h4 className="font-bold text-cv-gold mb-2">Ataque de Amplificación de DNS (DDoS)</h4>
          <p className="text-gray-300 mb-4">
            El atacante usa una botnet para enviar miles de pequeñas consultas DNS a servidores abiertos,
            pero falsifica (spoofing) la IP de origen para que sea la de la víctima. El factor de
            amplificación puede ser mayor a 50x.
          </p>
          <h4 className="font-bold text-cv-gold mb-2">Solución: DNSSEC</h4>
          <p className="text-gray-300">
            DNSSEC (Extensiones de Seguridad de DNS) agrega firmas criptográficas. Permite a un cliente
            verificar que la respuesta que recibe es auténtica (integridad de los datos) y no ha sido
            manipulada.
          </p>
        </>
      ),
    },
    {
      id: 'vlsm',
      icon: Network,
      title: 'Análisis Profundo: VLSM',
      content: (
        <>
          <h4 className="font-bold text-cv-gold mb-2">Subnetting Tradicional vs. VLSM</h4>
          <p className="text-gray-300 mb-4">
            VLSM (Máscara de Subred de Longitud Variable) resuelve el desperdicio masivo de IPs. El
            subneteo tradicional (FLSM) usa un tamaño fijo, VLSM usa tamaños variables adaptados a la
            necesidad real.
          </p>
          <h4 className="font-bold text-cv-gold mb-2">Beneficios</h4>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">✓</span>
              <span>Eficiencia máxima de direcciones IP</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">✓</span>
              <span>Ahorro de costos en bloques de IP</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">✓</span>
              <span>Mayor flexibilidad en diseño de red</span>
            </li>
          </ul>
        </>
      ),
    },
    {
      id: 'respuesta-incidentes',
      icon: RadioTower,
      title: 'Análisis Profundo: Respuesta a Incidentes',
      content: (
        <>
          <h4 className="font-bold text-cv-gold mb-2">Triaje de Incidentes</h4>
          <p className="text-gray-300 mb-4">
            En un ataque combinado, la prioridad es <strong>detener la brecha de datos</strong>. Un DDoS
            (disponibilidad) pierde ingresos; una brecha de C2 (confidencialidad/integridad) pierde datos,
            reputación y genera multas.
          </p>
          <h4 className="font-bold text-cv-gold mb-2">Contención: ¿Por qué NO apagar el servidor?</h4>
          <p className="text-gray-300 mb-4">
            <strong>¡Evidencia Volátil!</strong> Apagar un servidor comprometido destruye toda la evidencia
            en la memoria RAM: procesos maliciosos, conexiones de red activas, claves de cifrado, comandos
            ejecutados.
          </p>
          <p className="text-gray-300">
            <strong>Acción Correcta:</strong> Aislar el servidor (desconectar cable, mover a VLAN de
            cuarentena) y tomar una imagen forense de la RAM y del disco para análisis.
          </p>
        </>
      ),
    },
  ];

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
          Biblioteca de Recursos del SOC
        </h2>
        <p className="text-base md:text-lg text-gray-300 max-w-3xl mx-auto">
          Análisis detallado de los conceptos clave. Use esto para resolver los escenarios de capacitación.
        </p>
      </div>

      <div className="space-y-4">
        {modules.map((module) => {
          const Icon = module.icon;
          const isExpanded = expandedModule === module.id;

          return (
            <div
              key={module.id}
              className="bg-cv-dark-green/40 backdrop-blur-lg border-2 border-cv-gold/30 rounded-xl overflow-hidden hover:border-cv-gold/60 transition-all duration-300"
            >
              <div
                className="p-6 cursor-pointer flex items-center justify-between"
                onClick={() => toggleModule(module.id)}
              >
                <h3 className="text-xl font-bold text-green-300 flex items-center gap-3">
                  <Icon className="h-6 w-6 text-cv-gold flex-shrink-0" />
                  <span>{module.title}</span>
                </h3>
                <ChevronDown
                  className={`h-5 w-5 text-gray-400 transition-transform duration-300 flex-shrink-0 ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                />
              </div>

              {isExpanded && (
                <div className="px-6 pb-6 border-t border-cv-gold/30 pt-6 bg-cv-olive/20">
                  <div className="prose prose-invert max-w-none">{module.content}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

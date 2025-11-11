// src/components/glossary/Glossary.tsx
'use client';

import React from 'react';
import { BookOpenCheck } from 'lucide-react';

export const Glossary: React.FC = () => {
  const terms = [
    {
      term: 'Dirección IP (IPv4/IPv6)',
      definition:
        'Identificador numérico único para dispositivos en una red. (Ver: Guía IP, Fundamentos)',
    },
    {
      term: 'Modelo OSI',
      definition:
        'Modelo teórico de 7 capas (Física, Enlace, Red, Transporte, Sesión, Presentación, Aplicación) para entender la comunicación de redes. (Ver: Protocolos, Fundamentos)',
    },
    {
      term: 'Modelo TCP/IP',
      definition:
        'Modelo práctico de 4 capas (Acceso a Red, Internet, Transporte, Aplicación) sobre el que funciona Internet. (Ver: Protocolos, Fundamentos)',
    },
    {
      term: 'Protocolo',
      definition:
        'Conjunto de reglas que definen cómo se comunican los dispositivos. (Ver: Fundamentos, Protocolos)',
    },
    {
      term: 'TCP (Protocolo de Control de Transmisión)',
      definition:
        'Protocolo de Capa 4, fiable y orientado a conexión (como correo certificado). (Ver: Fundamentos, Protocolos)',
    },
    {
      term: 'UDP (Protocolo de Datagramas de Usuario)',
      definition:
        'Protocolo de Capa 4, rápido y no fiable (como tarjeta postal). (Ver: Fundamentos, Protocolos)',
    },
    {
      term: 'Puerto de Red',
      definition:
        'Identificador numérico (0-65535) que dirige el tráfico a una aplicación específica en un dispositivo. (Ver: Fundamentos)',
    },
    {
      term: 'Socket',
      definition:
        'Combinación de una Dirección IP y un Puerto, creando un punto final de comunicación único (ej. 192.168.1.1:443). (Ver: Fundamentos)',
    },
    {
      term: 'DNS (Sistema de Nombres de Dominio)',
      definition:
        'La "agenda telefónica" de Internet. Traduce nombres de dominio (cybervaltorix.com) a direcciones IP. (Ver: Recursos)',
    },
    {
      term: 'NetID y HostID',
      definition:
        'Las dos partes de una IP: el NetID identifica la red y el HostID identifica al dispositivo en esa red. (Ver: Recursos)',
    },
    {
      term: 'IP Pública vs. Privada',
      definition:
        'Pública (única en Internet) vs. Privada (reutilizable en redes locales, ej. 192.168.x.x). (Ver: Recursos)',
    },
    {
      term: 'NAT (Network Address Translation)',
      definition:
        'Permite a múltiples dispositivos en una red privada compartir una única IP pública. (Ver: Recursos)',
    },
    {
      term: 'Subnetting (Subredes)',
      definition:
        'Técnica de dividir una red grande en redes más pequeñas (subredes) para mejorar la organización y seguridad. (Ver: Recursos)',
    },
    {
      term: 'Máscara de Subred',
      definition:
        'Número (ej. 255.255.255.0 o /24) que define qué porción de una IP es el NetID y qué porción es el HostID. (Ver: Recursos)',
    },
    {
      term: 'VLSM (Máscara de Subred de Longitud Variable)',
      definition:
        'Técnica avanzada de subnetting que permite crear subredes de diferentes tamaños para maximizar la eficiencia de IPs. (Ver: Recursos)',
    },
    {
      term: 'Encapsulación',
      definition:
        'Proceso de "envolver" datos con encabezados de control a medida que bajan por las capas del modelo de red. (Ver: Recursos)',
    },
    {
      term: 'PDU (Unidad de Datos de Protocolo)',
      definition:
        'El nombre genérico de los "datos" en cada capa: Trama (Capa 2), Paquete (Capa 3), Segmento/Datagrama (Capa 4). (Ver: Recursos)',
    },
  ];

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
          Glosario de Inducción del SOC
        </h2>
        <p className="text-base md:text-lg text-gray-300 max-w-3xl mx-auto">
          Su vocabulario fundamental. Revise la pestaña "Recursos" para explicaciones detalladas.
        </p>
      </div>

      <div className="bg-cv-dark-green/40 backdrop-blur-lg border border-cv-gold/30 rounded-xl p-6">
        <h3 className="text-xl font-bold text-cv-gold mb-6 flex items-center gap-2">
          <BookOpenCheck className="w-6 h-6" />
          Términos Fundamentales
        </h3>

        <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
          {terms.map((item, index) => (
            <div key={index} className="space-y-2">
              <dt className="font-semibold text-white text-base">{item.term}</dt>
              <dd className="text-gray-300 text-sm leading-relaxed pl-4 border-l-2 border-cv-gold">
                {item.definition}
              </dd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

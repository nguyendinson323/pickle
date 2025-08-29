import { Request, Response } from 'express';
import models from '../models';

const { State } = models;

class DataController {
  async getStates(req: Request, res: Response) {
    try {
      const states = await State.findAll({
        attributes: ['id', 'name', 'code'],
        order: [['name', 'ASC']]
      });

      res.json({
        success: true,
        data: states
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: 'Error fetching states'
      });
    }
  }

  async getMembershipPlans(req: Request, res: Response) {
    try {
      // For now, return static data. Later this will come from database
      const plans = {
        player: [
          {
            id: 'player-basic',
            name: 'Jugador Básico',
            role: 'player',
            type: 'basic',
            annualFee: 500.00,
            description: 'Membresía básica de jugador con registro en la federación',
            features: [
              'Registro en la federación',
              'Credencial digital',
              'Participación en torneos'
            ]
          },
          {
            id: 'player-premium',
            name: 'Jugador Premium',
            role: 'player',
            type: 'premium',
            annualFee: 1200.00,
            description: 'Membresía premium de jugador con buscador de jugadores',
            features: [
              'Registro en la federación',
              'Credencial digital',
              'Participación en torneos',
              'Buscador de jugadores',
              'Soporte prioritario'
            ]
          }
        ],
        coach: [
          {
            id: 'coach-basic',
            name: 'Entrenador Básico',
            role: 'coach',
            type: 'basic',
            annualFee: 800.00,
            description: 'Membresía básica de entrenador',
            features: [
              'Registro en la federación',
              'Credencial digital',
              'Herramientas de entrenamiento'
            ]
          },
          {
            id: 'coach-premium',
            name: 'Entrenador Premium',
            role: 'coach',
            type: 'premium',
            annualFee: 1500.00,
            description: 'Membresía premium de entrenador con certificaciones',
            features: [
              'Registro en la federación',
              'Credencial digital',
              'Herramientas de entrenamiento',
              'Acceso a certificaciones',
              'Buscador de jugadores'
            ]
          }
        ],
        club: [
          {
            id: 'club-basic',
            name: 'Club Básico',
            role: 'club',
            type: 'basic',
            annualFee: 2000.00,
            description: 'Afiliación básica de club',
            features: [
              'Afiliación a la federación',
              'Gestión de miembros',
              'Micrositio básico'
            ]
          },
          {
            id: 'club-premium',
            name: 'Club Premium',
            role: 'club',
            type: 'premium',
            annualFee: 5000.00,
            description: 'Club premium con gestión de canchas y torneos',
            features: [
              'Afiliación a la federación',
              'Gestión de miembros',
              'Micrositio premium',
              'Gestión de canchas',
              'Creación de torneos'
            ]
          }
        ],
        partner: [
          {
            id: 'partner-premium',
            name: 'Socio Premium',
            role: 'partner',
            type: 'premium',
            annualFee: 8000.00,
            description: 'Membresía premium para socios',
            features: [
              'Gestión de canchas',
              'Creación de torneos',
              'Micrositio premium',
              'Herramientas de ingresos'
            ]
          }
        ],
        state: [
          {
            id: 'state-committee',
            name: 'Comité Estatal',
            role: 'state',
            type: 'basic',
            annualFee: 15000.00,
            description: 'Membresía de comité estatal',
            features: [
              'Administración estatal',
              'Gestión de torneos',
              'Micrositio',
              'Supervisión de miembros'
            ]
          }
        ]
      };

      const { role } = req.query;
      
      if (role && plans[role as keyof typeof plans]) {
        res.json({
          success: true,
          data: plans[role as keyof typeof plans]
        });
      } else {
        res.json({
          success: true,
          data: plans
        });
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: 'Error fetching membership plans'
      });
    }
  }

  async getPrivacyPolicy(req: Request, res: Response) {
    try {
      // For now, return static privacy policy. Later this will come from database
      const privacyPolicy = {
        version: '1.0',
        lastUpdated: '2024-01-01',
        title: 'Política de Privacidad - Federación Mexicana de Pickleball',
        content: `
**POLÍTICA DE PRIVACIDAD DE LA FEDERACIÓN MEXICANA DE PICKLEBALL**

**Última actualización: 1 de enero de 2024**

La Federación Mexicana de Pickleball ("nosotros", "nuestro" o "la Federación") se compromete a proteger la privacidad y seguridad de la información personal de nuestros usuarios.

**1. INFORMACIÓN QUE RECOPILAMOS**

Recopilamos la siguiente información personal:
- Datos de identificación personal (nombre, CURP, RFC)
- Información de contacto (correo electrónico, teléfono)
- Fotografía de perfil y documentos de identificación
- Información deportiva (nivel NRTP, historial de torneos)

**2. USO DE LA INFORMACIÓN**

Utilizamos su información para:
- Administrar su membresía en la federación
- Organizar torneos y eventos
- Emitir credenciales digitales
- Facilitar el contacto entre jugadores
- Cumplir con requisitos legales y deportivos

**3. PROTECCIÓN DE DATOS**

Implementamos medidas de seguridad técnicas y organizativas para proteger su información personal contra acceso no autorizado, alteración, divulgación o destrucción.

**4. COMPARTIR INFORMACIÓN**

No vendemos ni alquilamos su información personal. Podemos compartir información únicamente:
- Con su consentimiento explícito
- Para cumplir con obligaciones legales
- Con organizaciones deportivas oficiales cuando sea necesario

**5. SUS DERECHOS**

Usted tiene derecho a:
- Acceder a su información personal
- Rectificar datos inexactos
- Cancelar su cuenta
- Oponerse al procesamiento
- Portabilidad de datos

**6. CONTACTO**

Para ejercer sus derechos o realizar consultas sobre privacidad:
Email: privacidad@pickleballfed.mx
Teléfono: +52-555-123-4567

**7. CAMBIOS A ESTA POLÍTICA**

Nos reservamos el derecho de actualizar esta política. Los cambios serán notificados a través de nuestro sitio web y por correo electrónico.

Al usar nuestros servicios, usted acepta esta política de privacidad.
        `,
        downloadUrl: '/api/data/privacy-policy/download'
      };

      res.json({
        success: true,
        data: privacyPolicy
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: 'Error fetching privacy policy'
      });
    }
  }

  async downloadPrivacyPolicy(req: Request, res: Response) {
    try {
      // In a real implementation, this would generate a PDF
      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Content-Disposition', 'attachment; filename="politica-privacidad.txt"');
      
      const content = `POLÍTICA DE PRIVACIDAD - FEDERACIÓN MEXICANA DE PICKLEBALL

[Privacy policy content would be here in a real implementation]

Este documento contiene la política de privacidad completa de la Federación Mexicana de Pickleball.

Última actualización: 1 de enero de 2024
`;

      res.send(content);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: 'Error downloading privacy policy'
      });
    }
  }

  async getNrtpLevels(req: Request, res: Response) {
    try {
      const levels = [
        { value: '1.0', label: '1.0 - Principiante' },
        { value: '1.5', label: '1.5 - Principiante Avanzado' },
        { value: '2.0', label: '2.0 - Novato' },
        { value: '2.5', label: '2.5 - Novato Avanzado' },
        { value: '3.0', label: '3.0 - Intermedio' },
        { value: '3.5', label: '3.5 - Intermedio Avanzado' },
        { value: '4.0', label: '4.0 - Avanzado' },
        { value: '4.5', label: '4.5 - Avanzado Superior' },
        { value: '5.0', label: '5.0 - Experto' },
        { value: '5.5', label: '5.5 - Experto Superior' },
        { value: '6.0', label: '6.0 - Profesional' },
        { value: '6.5', label: '6.5 - Profesional Superior' },
        { value: '7.0', label: '7.0 - Profesional Elite' }
      ];

      res.json({
        success: true,
        data: levels
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: 'Error fetching NRTP levels'
      });
    }
  }

  async getGenderOptions(req: Request, res: Response) {
    try {
      const genders = [
        { value: 'male', label: 'Masculino' },
        { value: 'female', label: 'Femenino' },
        { value: 'other', label: 'Otro' }
      ];

      res.json({
        success: true,
        data: genders
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: 'Error fetching gender options'
      });
    }
  }
}

export default new DataController();
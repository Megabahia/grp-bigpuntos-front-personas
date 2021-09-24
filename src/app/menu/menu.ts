import { CoreMenu } from '@core/types'

export const menu: CoreMenu[] = [
  {
    id: 'inicio',
    title: 'Inicio',
    // translate: 'MENU.HOME',
    type: 'item',
    icon: 'home',
    url: 'personas/inicio',
    
  },
  {
    id: 'que-es',
    title: '¿Qué es super monedas?',
    // translate: 'MENU.SAMPLE',
    type: 'item',
    icon: 'info',
    url: 'personas/que-es'
  },
  {
    id: 'apps',
    type: 'section',
    title: 'Administración',
    // translate: 'MENU.APPS.SECTION',
    icon: 'package',
    children: [
      {
        id: 'superMonedas',
        title: 'Super monedas',
        // translate: 'MENU.PAGES.SECTION',
        type: 'collapsible',
        icon: 'dollar-sign',
        children: [
          {
            id: 'misSuperMonedas',
            title: 'Mis super monedas',
            // translate: 'MENU.APPS.EMAIL',
            type: 'item',
            icon: 'circle',
            url: 'personas/supermonedas/mis-monedas'
          },
          {
            id: 'cargarMisFacturas',
            title: 'Cargar mis facturas',
            // translate: 'MENU.APPS.EMAIL',
            type: 'item',
            icon: 'circle',
            url: 'personas/supermonedas/mis-facturas'
          },
          {
            id: 'calificarCompras',
            title: 'Calificar compras',
            // translate: 'MENU.APPS.EMAIL',
            type: 'item',
            icon: 'circle',
            url: 'personas/supermonedas/mis-calificaciones'
          },
          {
            id: 'compartirPublicaciones',
            title: 'Compartir publicaciones',
            // translate: 'MENU.APPS.EMAIL',
            type: 'item',
            icon: 'circle',
            url: 'personas/supermonedas/compartir-publicaciones'
          },
          {
            id: 'monedasOtorgadas',
            title: 'Monedas por compras en locales afiliados',
            // translate: 'MENU.APPS.EMAIL',
            type: 'item',
            icon: 'circle',
            url: 'personas/supermonedas/monedas-otorgadas'
          }
        ]
      },

    ]
  },
]

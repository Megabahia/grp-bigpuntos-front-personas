import {CoreMenu} from '@core/types';
import {Role} from '../auth/models/role';

export const menu: CoreMenu[] = [
    {
        id: 'inicio',
        title: 'Inicio',
        // translate: 'MENU.HOME',
        role: [Role.BigPuntos],
        type: 'item',
        icon: 'home',
        url: 'personas/inicio',

    },
    {
        id: 'que-es',
        title: '¿Qué es Big Puntos?',
        // translate: 'MENU.SAMPLE',
        type: 'item',
        icon: 'info',
        url: 'personas/que-es'
    },
    {
        id: 'como-funciona',
        title: '¿Cómo funciona?',
        // translate: 'MENU.SAMPLE',
        type: 'item',
        icon: 'info',
        url: 'personas/como-funciona'
    },
    {
        id: 'en-donde-canjear',
        title: '¿En dónde canjear?',
        // translate: 'MENU.SAMPLE',
        type: 'item',
        icon: 'info',
        url: 'personas/donde-canjear'
    },
    {
        id: 'apps',
        type: 'section',
        title: 'Administración',
        role: [Role.BigPuntos],
        // translate: 'MENU.APPS.SECTION',
        icon: 'package',
        children: [
            {
                id: 'misSuperMonedas',
                title: 'Mis Big Puntos',
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
            },
            {
                id: 'pagarSupermonedas',
                title: 'Pagar con Big Puntos',
                // translate: 'MENU.APPS.EMAIL',
                type: 'item',
                icon: 'circle',
                url: 'personas/supermonedas/pagar-con-supermonedas'
            },
            // {
            //   id: 'creditosAutonomos',
            //   title: 'Créditos para Autónomos',
            //   role: [Role.BigPuntos],
            //   // translate: 'MENU.PAGES.SECTION',
            //   type: 'collapsible',
            //   icon: 'credit-card',
            //   children: [
            //     {
            //       id: 'solicitarCreditoAut',
            //       title: 'Solicitar crédito',
            //       // translate: 'MENU.APPS.EMAIL',
            //       type: 'item',
            //       icon: 'circle',
            //       url: 'personas/creditos-autonomos/solicitar-credito'
            //     },
            //   ]
            // },
            // {
            //   id: 'creditosEmpleado',
            //   title: 'Empleado',
            //   role: [Role.BigPuntos],
            //   // translate: 'MENU.PAGES.SECTION',
            //   type: 'collapsible',
            //   icon: 'credit-card',
            //   children: [
            //     {
            //       id: 'creditosPreEmp',
            //       title: 'Créditos preaprobados',
            //       // translate: 'MENU.APPS.EMAIL',
            //       type: 'item',
            //       icon: 'circle',
            //       url: 'personas/creditos-empleados/creditos-pre-aprobados'
            //     }
            //   ]
            // },
            // {
            //   id: 'creditosPreAprobados',
            //   title: 'Créditos Pre Aprobados',
            //   role: [Role.BigPuntos],
            //   // translate: 'MENU.PAGES.SECTION',
            //   type: 'collapsible',
            //   icon: 'credit-card',
            //   children: [
            //     {
            //       id: 'listadoCreditosPre',
            //       title: 'Listado de créditos Pre Aprobados',
            //       // translate: 'MENU.APPS.EMAIL',
            //       type: 'item',
            //       icon: 'circle',
            //       url: 'personas/creditos-pre-aprobados/listado'
            //     }
            //   ]
            // },
            // {
            //   id: 'misCreditos',
            //   title: 'Mis créditos',
            //   role: [Role.BigPuntos],
            //   // translate: 'MENU.PAGES.SECTION',
            //   type: 'collapsible',
            //   icon: 'credit-card',
            //   children: [
            //     {
            //       id: 'estadoCreditos',
            //       title: 'Estado de mis créditos',
            //       // translate: 'MENU.APPS.EMAIL',
            //       type: 'item',
            //       icon: 'circle',
            //       url: 'personas/mis-creditos/estado-creditos'
            //     },
            //     {
            //       id: 'registrarPagoCuotas',
            //       title: 'Registrar pago de cuota',
            //       // translate: 'MENU.APPS.EMAIL',
            //       type: 'item',
            //       icon: 'circle',
            //       url: 'personas/mis-creditos/registrar-pagos-cuotas'
            //     }
            //   ]
            // },
            {
                id: 'reclamosRequerimientos',
                title: 'Reclamos y Requerimientos',
                role: [Role.BigPuntos],
                // translate: 'MENU.PAGES.SECTION',
                type: 'item',
                icon: 'message-circle',
                url: 'personas/reclamos-y-requerimientos',
            },
            {
                id: 'misPremios',
                title: 'Mis premios',
                role: [Role.BigPuntos],
                // translate: 'MENU.PAGES.SECTION',
                type: 'item',
                icon: 'message-circle',
                url: 'personas/mis-premios',
            },
        ]
    },

];

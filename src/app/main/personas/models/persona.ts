export class CompletarPerfil {
    identificacion: string;
    nombres: string;
    apellidos: string;
    genero: string;
    fechaNacimiento: string;
    edad: number;
    whatsapp: string;
    user_id: string;
}
export class InformacionBasica {
    genero: string;
    fechaNacimiento: string;
    edad: number;
    ciudad: string;
    emailAdicional: string;
    whatsapp: string;
    facebook: string;
    instagram: string;
    twitter: string;
    tiktok: string;
    youtube: string;
    user_id: string;
}
export class InformacionCompleta {
    created_at: string;
    identificacion: string;
    nombres: string;
    apellidos: string;
    genero: string;
    fechaNacimiento: string;
    edad: number;
    direccion: string;
    ciudad: string;
    provincia: string;
    pais: string;
    email: string;
    emailAdicional: string;
    telefono: string;
    whatsapp: string;
    facebook: string;
    instagram: string;
    twitter: string;
    tiktok: string;
    youtube: string;
}
export class SolicitarCredito {
    _id: string;
    numero: string;
    monto: number;
    plazo: number;
    aceptaTerminos: boolean;
    estado: string;
    user_id: string;
    empresaComercial_id: string;
    empresaIfis_id: string;
}
export class RucPersona {
    actividadComercial: string;
    antiguedadRuc: number;
    ciudad: string;
    gastoMensual: number;
    identificacion: string;
    nombreComercial: string;
    pais: string;
    provincia: string;
    razonSocial: string;
    ruc: string;
    user_id: string;
    ventaMensual: number;
    _id: string;
}

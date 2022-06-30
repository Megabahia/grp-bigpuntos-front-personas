import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { CoreConfigService } from '../../../../@core/services/config.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ParametrizacionesService } from '../../personas/servicios/parametrizaciones.service';
import Decimal from 'decimal.js';

@Component({
    selector: 'app-simulador',
    templateUrl: './simulador.component.html',
    styleUrls: ['./simulador.component.scss']
})
export class SimuladorComponent implements OnInit {
    private _unsubscribeAll: Subject<any>;
    public simuladorForm: FormGroup;
    public info: {};
    public tableview = true;
    public iconsAmor: any;
    private iconsTipoPers: [];
    private iconsProductso: [];
    private iconsSubProducto: [];
    private iconsFrePago: [];
    public submittedSimulador = false;
    public banner1;
    public banner2;


    constructor(
        private _coreConfigService: CoreConfigService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private paramService: ParametrizacionesService,
    ) {
        const ref = document.referrer;
        if (ref !== 'https://credicompra.com/') {
            this._router.navigate([
                `/grp/login`,
            ]);
            localStorage.clear();
            return;
        }
        localStorage.setItem('simulador', 'ok');
        this.getSelectContet();
        this._unsubscribeAll = new Subject();
        // Configure the layout

        this._coreConfigService.config = {
            layout: {
                navbar: {
                    hidden: true,
                },
                footer: {
                    hidden: true,
                },
                menu: {
                    hidden: true,
                },
                customizer: false,
                enableLocalStorage: false,
            },
        };
    }

    get getsimuladorForm() {
        return this.simuladorForm.controls;
    }

    ngOnInit(): void {
        this.simuladorForm = this._formBuilder.group({
            date: [''],
            system: ['', [Validators.required]],
            typePerson: ['', [Validators.required]],
            product: ['', [Validators.required]],
            subProduct: ['', [Validators.required]],
            monto: ['', [Validators.required]],
            plazo: ['', [Validators.required]],
            frequencyPay: ['', [Validators.required]],
            desgravamen: [''],

        });
        this.simuladorForm.controls['date'].setValue(new Date(Date.now()).toLocaleDateString('pt-PT'));
        this.simuladorForm.controls['desgravamen'].setValue('Si');
        this.paramService.obtenerListaPadresSinToken('SIMULADOR_BANNER1').subscribe((info) => {
            this.banner1 = info[0].valor;
        });
        this.paramService.obtenerListaPadresSinToken('SIMULADOR_BANNER2').subscribe((info) => {
            this.banner2 = info[0].valor;
        });
    }

    getSelectContet() {
        this.paramService.obtenerListaPadresSinToken('AMORTIZACION').subscribe((info) => {
            this.iconsAmor = info;
        });
        this.paramService.obtenerListaPadresSinToken('TIPO_PERSONA').subscribe((info) => {
            this.iconsTipoPers = info;
        });
        this.paramService.obtenerListaPadresSinToken('PRODUCTO').subscribe((info) => {
            this.iconsProductso = info;
        });
        this.paramService.obtenerListaPadresSinToken('SUBPRODUCTO').subscribe((info) => {
            this.iconsSubProducto = info;
        });
        this.paramService.obtenerListaPadresSinToken('FRECUENCIA_PAGO').subscribe((info) => {
            this.iconsFrePago = info;
        });
    }

    viewsOpen() {
        this.tableview = false;
    }

    viewsClose() {
        this.tableview = true;
    }

    actionContinue() {
        this._router.navigate([
            `/grp/login`,
        ]);
    }

    calcularAmortizacion() {
        this.submittedSimulador = true;
        if (this.simuladorForm.invalid) {
            return;
        }
        this.viewsOpen();
        const capital = new Decimal(this.simuladorForm.value.monto).toNumber();
        const time = new Decimal(this.simuladorForm.value.plazo).toNumber();
        // const interes = 0.20 / (time / 12); // cambiar el interes
        const interes = Decimal.div(
            0.05,
            Decimal.div(time, this.simuladorForm.value.frequencyPay).toNumber()
        ).toNumber(); // cambiar el interes
        const terminoAmortizativo = new Decimal(
            Decimal.div(
                Decimal.mul(capital, interes),
                Decimal.sub(
                    1,
                    Decimal.pow(
                        Decimal.add(1, interes),
                        -time
                    )
                )
            )
        ).toNumber();

        const table = [
            {
                'terminoAmortizativo': 0,
                'interePen': 0,
                'CuotaPend': 0,
                'capitalpendi': capital,
            }
        ];

        this.info = {
            'fecha': this.simuladorForm.value.date,
            'system': this.simuladorForm.value.system,
            'interes': interes,
            'typePerson': this.simuladorForm.value.typePerson,
            'product': this.simuladorForm.value.product,
            'subProduct': this.simuladorForm.value.subProduct,
            'monto': this.simuladorForm.value.monto,
            'plazo': this.simuladorForm.value.plazo,
            'desgravamen': this.simuladorForm.value.desgravamen,
            'frequencyPay': this.simuladorForm.value.frequencyPay,
        };
        for (let i = 1; i <= time; i++) {
            const interePen = new Decimal(Decimal.mul(interes, table[i - 1].capitalpendi)).toNumber();
            const CuotaPend = new Decimal(Decimal.sub(terminoAmortizativo, interePen)).toNumber();
            const capitalpendi = new Decimal(Decimal.sub(table[i - 1].capitalpendi, CuotaPend)).toNumber();
            table.push({
                'terminoAmortizativo': terminoAmortizativo,
                'interePen': interePen,
                'CuotaPend': CuotaPend,
                'capitalpendi': capitalpendi,
            });
        }
        this.info['table'] = table.map((item) => {
            return {
                'terminoAmortizativo': item.terminoAmortizativo.toFixed(2),
                'interePen': item.interePen.toFixed(2),
                'CuotaPend': item.CuotaPend.toFixed(2),
                'capitalpendi': Math.abs(Number(item.capitalpendi.toFixed(2))),
            };
        });
    }
}

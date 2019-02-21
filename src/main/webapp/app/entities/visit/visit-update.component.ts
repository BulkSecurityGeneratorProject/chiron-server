import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IVisit } from 'app/shared/model/visit.model';
import { VisitService } from './visit.service';
import { IPatient } from 'app/shared/model/patient.model';
import { PatientService } from 'app/entities/patient';
import { IDoctor } from 'app/shared/model/doctor.model';
import { DoctorService } from 'app/entities/doctor';
import { IReceipt } from 'app/shared/model/receipt.model';
import { ReceiptService } from 'app/entities/receipt';

@Component({
    selector: 'jhi-visit-update',
    templateUrl: './visit-update.component.html'
})
export class VisitUpdateComponent implements OnInit {
    visit: IVisit;
    isSaving: boolean;

    patients: IPatient[];

    doctors: IDoctor[];

    receipts: IReceipt[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected visitService: VisitService,
        protected patientService: PatientService,
        protected doctorService: DoctorService,
        protected receiptService: ReceiptService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ visit }) => {
            this.visit = visit;
        });
        this.patientService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IPatient[]>) => mayBeOk.ok),
                map((response: HttpResponse<IPatient[]>) => response.body)
            )
            .subscribe((res: IPatient[]) => (this.patients = res), (res: HttpErrorResponse) => this.onError(res.message));
        this.doctorService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IDoctor[]>) => mayBeOk.ok),
                map((response: HttpResponse<IDoctor[]>) => response.body)
            )
            .subscribe((res: IDoctor[]) => (this.doctors = res), (res: HttpErrorResponse) => this.onError(res.message));
        this.receiptService
            .query({ filter: 'visit-is-null' })
            .pipe(
                filter((mayBeOk: HttpResponse<IReceipt[]>) => mayBeOk.ok),
                map((response: HttpResponse<IReceipt[]>) => response.body)
            )
            .subscribe(
                (res: IReceipt[]) => {
                    if (!this.visit.receipt || !this.visit.receipt.id) {
                        this.receipts = res;
                    } else {
                        this.receiptService
                            .find(this.visit.receipt.id)
                            .pipe(
                                filter((subResMayBeOk: HttpResponse<IReceipt>) => subResMayBeOk.ok),
                                map((subResponse: HttpResponse<IReceipt>) => subResponse.body)
                            )
                            .subscribe(
                                (subRes: IReceipt) => (this.receipts = [subRes].concat(res)),
                                (subRes: HttpErrorResponse) => this.onError(subRes.message)
                            );
                    }
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.visit.id !== undefined) {
            this.subscribeToSaveResponse(this.visitService.update(this.visit));
        } else {
            this.subscribeToSaveResponse(this.visitService.create(this.visit));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IVisit>>) {
        result.subscribe((res: HttpResponse<IVisit>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackPatientById(index: number, item: IPatient) {
        return item.id;
    }

    trackDoctorById(index: number, item: IDoctor) {
        return item.id;
    }

    trackReceiptById(index: number, item: IReceipt) {
        return item.id;
    }
}
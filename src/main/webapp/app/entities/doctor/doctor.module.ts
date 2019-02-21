import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { ChironServerSharedModule } from 'app/shared';
import {
    DoctorComponent,
    DoctorDetailComponent,
    DoctorUpdateComponent,
    DoctorDeletePopupComponent,
    DoctorDeleteDialogComponent,
    doctorRoute,
    doctorPopupRoute
} from './';

const ENTITY_STATES = [...doctorRoute, ...doctorPopupRoute];

@NgModule({
    imports: [ChironServerSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [DoctorComponent, DoctorDetailComponent, DoctorUpdateComponent, DoctorDeleteDialogComponent, DoctorDeletePopupComponent],
    entryComponents: [DoctorComponent, DoctorUpdateComponent, DoctorDeleteDialogComponent, DoctorDeletePopupComponent],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ChironServerDoctorModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}

import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot } from '../../node_modules/@angular/router';
import { Form } from './form'

export interface MasterService {
    getFormFromRoute(route: ActivatedRouteSnapshot, id: number): Observable<Form>

    getForm(cat: string, sub: string, id: number): Observable<Form>

    getAllForms(cat: string, sub: string): Observable<Form[]> 

    getTools(): Observable<string[]> 
    
    getEquipment(): Observable<string[]> 
    
    getLandscape(): Observable<string[]> 

    addForm(input: Form): Observable<number>   

    addSubcategory(cat: string, input: string): Observable<Object>
}

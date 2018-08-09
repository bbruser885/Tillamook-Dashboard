import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ActivatedRouteSnapshot } from '../../node_modules/@angular/router';
import { Form } from './form'
import { MasterService } from './master-service';

const pythonURL = 'http://127.0.0.1:5000';

@Injectable({
  providedIn: 'root'
})

export class DashService implements MasterService {

  constructor(private http: HttpClient) { }

  /**
   * Gets a specific form based on its ID. This version extracts the route for you
   * @deprecated - Not currently working well
   * @param route - ActivatedRouteSnapshot of your current location
   * @param id - The form ID number
   * @todo Restructure routing so that we can make a few assumptions about the format of the route
   */
  getFormFromRoute(route: ActivatedRouteSnapshot, id: number): Observable<Form> {
    var routeUrl = route.url;
    var category = routeUrl[0];
    var subcategory = routeUrl[1];   
    return this.http.get<Form>(pythonURL + category + subcategory).pipe(
      catchError(this.handleError('getForm', undefined)),
      tap(data => console.log(data)
    )); 
  }

  /**
   * Gets a specific form based on an explicit path and ID
   * @param cat - The category of the form
   * @param sub - The subcategory of the form
   * @param id - The form ID number
   */
  getForm(cat: string, sub: string, id: number): Observable<Form> {
    return this.http.get<Form>(pythonURL + '/form/' + cat + '/' + sub + '/' + id).pipe(
      catchError(this.handleError('getForm', undefined)),
      tap(data => console.log(data)
    )); 
  }

  /**
   * Gets all forms for a category and subcategory
   * @param cat - The category of the form dump
   * @param sub - The subcategory of the form dump
   * 
   */
  getAllForms(cat: string, sub: string): Observable<Form[]> {
    return this.http.get<Form>(pythonURL + '/' + cat.toLowerCase() + '/' + sub.toLowerCase()).pipe(
      catchError(this.handleError('getAllForms', null)),
      tap(data => console.log(data)
    ));
  }

  /**
   * Gets a list of all possible Tool subcategories
   * @returns string[] of subcategories
   */
  getTools(): Observable<string[]> {
    return this.http.get<string[]>(pythonURL + '/subcatlist/tools').pipe(
      catchError(this.handleError('getForm', [''])),
      tap(data => console.log(data)
    )); 
  }

  /**
   * Gets a list of all possible Equipment subcategories
   * @returns string[] of subcategories
   */
  getEquipment(): Observable<string[]> {
    return this.http.get<string[]>(pythonURL + '/subcatlist/equipment').pipe(
      catchError(this.handleError('getForm', [''])),
      tap(data => console.log(data)
    )); 
  }

  /**
   * Gets a list of all possible Landscape subcategories
   * @returns string[] of subcategories
   */
  getLandscape(): Observable<string[]> {
    return this.http.get<string[]>(pythonURL + '/subcatlist/landscape').pipe(
      catchError(this.handleError('getForm', [''])),
      tap(data => console.log(data)
    )); 
  }

  /**
   * @param input - A completed form object without a formid
   * @returns - The assigned formid or 0 if unsuccessful
   * 
   */
  addForm(input: Form): Observable<number> {
    var route = pythonURL + '/' + 'form/' + input.category.toLowerCase() + '/' + input.subcat.toLowerCase();
    return this.http.post<number>(route, input).pipe(
      catchError(this.handleError('addForm', 0)),
      tap(data => console.log(data)
    ));
  }

  /**
   * Adds a new subcategory to the database under a parent category
   * @param cat - The category to be placed under
   * @param input - The name of the category
   */
  addSubcategory(cat: string, input: string): Observable<Object> {
    var route = pythonURL + '/' + cat.toLowerCase() + '/sub/' + input;
    return this.http.post(route, {}, { responseType: "text" }).pipe(
      catchError(this.handleError('addSubcateogry')),
      tap(data => console.log(data)
    ));    
  }

/**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
 
    console.log(`${operation} failed: ${error.message}`);
    return of(result as T);

    };
  }


}
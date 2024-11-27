import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GuestInformation } from './GuestInformation';
import { CreateSurveyAnswersRequest } from './CreateSurveyAnswersRequest';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SurveysService {
  private url: string = 'https://casamento.carlosmorgado.me/api/survey-answers';

  constructor(private http: HttpClient) { }

  createAnswer(answers: GuestInformation[]): Observable<object> {
    const request: CreateSurveyAnswersRequest = {
      GuestInformation: answers,
    };

    console.log(this.url);
    console.log(request);

    return this.http.post(this.url, request);
  }
}

import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterFormComponent } from './register-form/register-form.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { TrainSearchComponent } from './train-search/train-search.component';
import { TicketBuyComponent } from './ticket-buy/ticket-buy.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { FirstComponent } from './first-page/first/first.component';
import { JwtInterceptor } from './jwt.interceptor';

@NgModule({
  declarations: [
       AppComponent,
    RegisterFormComponent,
    LoginFormComponent,
    TrainSearchComponent,
    TicketBuyComponent,
    AdminPanelComponent,
    FirstComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    provideClientHydration(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

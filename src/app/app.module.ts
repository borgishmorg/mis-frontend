import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminComponent } from './admin/admin.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './jwt.interceptor';
import { ErrorInterceptor } from './error.interceptor';
import { FakeBackendInterceptor } from './fake-backend.interceptor';
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatIconModule } from '@angular/material/icon'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'

@NgModule({
  declarations: [
	AppComponent,
	AdminComponent,
	HomeComponent,
	LoginComponent
  ],
  imports: [
	BrowserModule,
	AppRoutingModule,
	BrowserAnimationsModule,
	ReactiveFormsModule,
	HttpClientModule,
	MatToolbarModule,
	MatButtonModule,
	MatCardModule,
	MatFormFieldModule,
	MatInputModule,
	MatIconModule,
	MatProgressSpinnerModule
  ],
  providers: [
	{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
	{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
	// provider used to create fake backend
	{ provide: HTTP_INTERCEPTORS, useClass: FakeBackendInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

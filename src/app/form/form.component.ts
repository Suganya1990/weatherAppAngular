import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { WeatherService } from '../weather.service';
import { Weather } from '../weather';
import { faLocationArrow } from '@fortawesome/free-solid-svg-icons';
import { ThisReceiver } from '@angular/compiler';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
  providers: [WeatherService],
})
export class FormComponent {
  //intialise forms, but still not validating when empty input boxes
  userInputForm = new FormGroup({
    country: new FormControl('', Validators.required),
    province: new FormControl(''),
    city: new FormControl('', Validators.required),
  });

  //intialize variables
  country = '';
  province = '';
  city = '';
  errorMessage = '';
  metric = '';
  currentWeather: Weather = new Weather();
  faLocation = faLocationArrow;

  constructor(private weatherService: WeatherService) {}

  setLocation = () => {
    // sets country
    if (
      this.userInputForm.controls['country'].value ||
      this.userInputForm.controls['city'].value
    ) {
      this.country = this.userInputForm.controls['country'].value;
      this.city = this.userInputForm.controls['city'].value;
    }

    // checks for empty values for city and country
    if (this.userInputForm.controls['country'].value === '') {
      this.resetLocation('country');
    }
    if (this.userInputForm.controls['city'].value === '') {
      this.resetLocation('city');
    }

    //no need to check this is a optional field
    this.province = this.userInputForm.controls['province'].value;
  };

  resetLocation = (field: string) => {
    if (field === 'country') this.country = '';
    if (field === 'province') this.province = '';
    if (field === 'city') this.city = '';
    this.errorMessage = `Please Enter ${field}`;
    alert(this.errorMessage);
  };

  reset = () => {
    this.currentWeather = {
      temp: 0,
      weatherCondition: '',
      feels_like: null,
      humidity: null,
      temp_min: null, //min current temperature in the city
      temp_max: null, //max current temperature in the city
      windSpeed: null,
    };

    this.country = '';
    this.city = '';
    this.province = '';
  };

  onSubmit() {
    this.setLocation();
    if (this.errorMessage === '') {
      this.weatherService
        .getData(this.country, this.province, this.city)
        .subscribe(
          (response) => {
            let data: any = response;

            this.currentWeather = data.main;
            this.currentWeather.weatherCondition = data.weather[0].description;
            this.currentWeather.windSpeed = data.wind.speed;
            this.metric = this.weatherService.getMetric();
          },
          (error) => {
            this.errorMessage = error;
            this.reset();
            alert('Could not find your location');
          }
        );
    } else {
      this.errorMessage = '';
      this.reset();
    }
  }
}

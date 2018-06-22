import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'wf24-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'wf24';
  // slides = [
  //   {name: "Меню 1", img: "http://placehold.it/350x150/000000"},
  //   {name: "Меню 2", img: "http://placehold.it/350x150/111111"},
  //   {name: "Меню 3", img: "http://placehold.it/350x150/333333"},
  //   {name: "Меню 4", img: "http://placehold.it/350x150/666666"},
  //   {name: "Меню 5", img: "http://placehold.it/350x150/000000"},
  //   {name: "Меню 6", img: "http://placehold.it/350x150/111111"},
  //   {name: "Меню 7", img: "http://placehold.it/350x150/333333"}
  // ];
  // slideConfig = {
  //   "slidesToShow": 6, //this.slides.length + 1,
  //   "slidesToScroll": 3,
  //   centerMode: true,
  //   responsive: [
  //     {
  //       breakpoint: 768,
  //       settings: {
  //         arrows: false,
  //         centerMode: true,
  //         centerPadding: '40px',
  //         slidesToShow: 3
  //       }
  //     },
  //     {
  //       breakpoint: 480,
  //       settings: {
  //         arrows: false,
  //         centerMode: true,
  //         centerPadding: '40px',
  //         slidesToShow: 1
  //       }
  //     }
  //   ]
  // };
  //
  // addSlide() {
  //   this.slides.push({img: "http://placehold.it/350x150/777777"})
  // }
  //
  // removeSlide() {
  //   this.slides.length = this.slides.length - 1;
  // }
  //
  // afterChange(e) {
  //   console.log('afterChange');
  // }

  ngOnInit () {
    console.log(window);






  }
}

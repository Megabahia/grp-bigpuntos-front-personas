import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'ecommerce-application' }
})
export class PrincipalComponent implements OnInit {
  // public
  public contentHeader: object;
  public product;
  public wishlist;
  public cartList;
  public relatedProducts =
    [
      {
        id: 3,
        name: 'Apple Watch Series 6',
        slug: 'willful-smart-watch-for-men-women-2020-3',
        description:
          'Are you looking for a smart watch, which can not only easily keep tracking of your steps, calories, heart rate and sleep quality, but also keep you informed of incoming calls.',
        brand: 'Mundo MAC',
        price: 29.99,
        image: 'assets/images/pages/eCommerce/25.png',
        hasFreeShipping: true,
        rating: 5
      },
      {
        id: 7,
        name: 'Bugani M90 Portable Bluetooth Speaker',
        slug: 'bugani-m90-portable-bluetooth-speaker-7',
        description:
          'Bluetooth Speakers-The M90 Bluetooth speaker uses the latest Bluetooth 5.0 technology and the latest Bluetooth ATS chip, Connecting over Bluetooth in seconds to iPhone, iPad, Smart-phones, Tablets, Windows, and other Bluetooth devices.',
        brand: 'Bugani',
        price: 56.0,
        image: 'assets/images/pages/eCommerce/21.png',
        hasFreeShipping: false,
        rating: 3
      }
    ]

  public swiperResponsive: SwiperConfigInterface = {
    slidesPerView: 3,
    spaceBetween: 50,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },
    breakpoints: {
      1024: {
        slidesPerView: 3,
        spaceBetween: 40
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 30
      },
      640: {
        slidesPerView: 2,
        spaceBetween: 20
      },
      320: {
        slidesPerView: 1,
        spaceBetween: 10
      }
    }
  };

  constructor() { }

  ngOnInit(): void {
  }

}

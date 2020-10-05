import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class KaplanrubenService {

  suit: number[];
  constructor() {

  }

  calcualteKNR(cards) {
    var KNR = 0;
    var minLength = 13;
    for (let index = 0; index < 4; index++) {
      var suitKnr = 0;
      var suit = cards.slice(0 + (index * 13), 13 + (index * 13))
      var suitLength = this.getSuitLength(suit);
      minLength = Math.min(minLength, suitLength);
      suitKnr = suitLength * this.calculatesuitLevel1(suit, suitLength) / 10;
      //console.log("suitKNR(1): " + suitKnr);
      suitKnr += this.calculatesuitLevel2(suit, suitLength);
      KNR += suitKnr;
      //console.log("suitKNR(2): " + suitKnr);
    }

    KNR += -1;
    if (minLength == 3) {
      KNR += 0.5;
    }
    return KNR;
  }
  
  getSuitLength(suit: any) {
    //console.log(suit);
    //debugger;
    var len = 0;
    for (let index = 0; index < 13; index++) {
      if (suit[index].selected) {
        len++;
      }
    }
    return len;
  }

  calculatesuitLevel2(suit: any, len: number) {
    var sum = 0;
    //console.log(this.hasCard(suit, 14))
    //Step 13
    if (this.hasCard(suit, 14)) {
      sum += 3;
    }
    //Step 14-15
    if (this.hasCard(suit, 13)) {
      if (len > 1) {
        sum += 2;
      } else {
        sum += 0.5;
      }
    }
    //Step 16
    if (this.hasCard(suit, 12)) {
      if (len == 2) {
        // Step19
        sum += 0.25;
        if (this.hasCard(suit, 13) || this.hasCard(suit, 14)) {
          // Step18
          sum += 0.25;
        }         
      }
      if (len > 2) {
        // Step17
        sum += 0.75;
        if (this.hasCard(suit, 13) || this.hasCard(suit, 14)) {
          // Step16
          sum += 0.25;
        }
      }
    }
    //Step 20
    if (this.hasCard(suit, 11) && this.honorCount(suit) == 2) {
      sum += 0.5;
    }
    //Step 21
    if (this.hasCard(suit, 11) && this.honorCount(suit) == 1) {
      sum += 0.25;
    }
    //Step 22
    if (this.hasCard(suit, 10) && this.honorCount(suit) == 2) {
      sum += 0.25;
    }
    //Step 23
    if (this.hasCard(suit, 9) && this.hasCard(suit, 10) && this.honorCount(suit) == 1) {
      sum += 0.25;
    }
    //Step 24
    if (len == 0) {
      sum += 3;
    }
    //Step 25
    if (len == 1) {
      sum += 2;
    }
    //Step 26
    if (len == 2) {
      sum += 1;
    }
    return sum;
  }

  calculatesuitLevel1(suit: any, len: number) {
    //console.log(suit);
    var sum = 0;
    //console.log(this.hasCard(suit, 14))
    //Step 1
    if (this.hasCard(suit, 14)) {
      sum += 4;
    }
    //Step 2
    if (this.hasCard(suit, 13)) {
      sum += 3;
    }
    //Step 3
    if (this.hasCard(suit, 12)) {
      sum += 2;
    }
    //Step 4
    if (this.hasCard(suit, 11)) {
      sum += 1;
    }
    //Step 5
    if (this.hasCard(suit, 10)) {
      sum += 0.5;
    }
    //Step 6
    if (len <= 6 && len >= 2) {
      if (this.hasCard(suit, 10) && (this.hasCard(suit, 11) || this.honorCount(suit) >= 2)) {
        sum += 0.5;
      }
    }
    //Step 7
    if (len <= 6 && len >= 2) {
      if (this.hasCard(suit, 8) && (this.hasCard(suit, 9) && this.hasCard(suit, 10) ||  this.honorCount(suit) == 2 )) {
        sum += 0.5;
      }
    }
    //Step 8
    if (len <= 6 && len >= 4) {
      if (this.hasCard(suit, 9) && !this.hasCard(suit, 10) && !this.hasCard(suit, 8) && this.honorCount(suit) == 3 ) {
        sum += 0.5;
      }
    }
    //Step 9
    if (len >= 7) {
      if (!this.hasCard(suit, 12) || !this.hasCard(suit, 11)) {
        sum += 1;
      }
    }
    //Step 10
    if (len >= 8) {
      if (!this.hasCard(suit, 12)) {
        sum += 1;
      }

    }
    //Step 11
    if (len >= 9) {
      if (!this.hasCard(suit, 12) && !this.hasCard(suit, 11)) {
        sum += 1;
      }
    }
    return sum;
  }

  hasCard(suit, card) {
    return suit[14 - card].selected;
  }

  honorCount(suit) {
    var count = 0;
    if (suit[0].selected) {
      count++;
    }
    if (suit[1].selected) count++;
    if (suit[2].selected) count++;
    if (suit[3].selected) count++;
    return count;
  }
}

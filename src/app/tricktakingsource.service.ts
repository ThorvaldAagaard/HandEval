import { Injectable } from '@angular/core';

//Start from HCP:
//● Start with the raw HCP total using the 4 - 3 - 2 - 1 scale.
//Adjust for undervalued and overvalued honors:
//● Add one “+” for every ace and every ten.
//● Add one “−” for every queen and jack.
//Adjust for insufficiently guarded honors:
//● Add two “−” for a doubleton headed by a queen.
//● Add one “−” for a doubleton headed by a jack.
//● Add one “−” for a tripleton headed by a jack.
//Adjust for positive and negative honor synergy:
//● Add one “+” for a 3 + -card suit headed by AQ or AJ.
//● Add one “+” for a 3 + -card suit headed by KJ.
//● Add one “−” for any suit headed by “AK”.

@Injectable({
  providedIn: 'root'
})
export class TricktakingsourceService {
  suit: number[];

  constructor() { 
  }

  calculateTTS(cards, hcpSum): any {
    var addings = 0;
    var subtracts = 0;
    for (let index = 0; index < 4; index++) {
      var suit = cards.slice(0 + (index * 13), 13 + (index * 13))
      addings += this.calclualteAddings(suit);
      subtracts += this.calculateSubtracts(suit);
    }

    if (addings >= subtracts) {
      var sum = addings - subtracts;
      var quotient = ((addings - subtracts) / 3) >> 0;
      var remainder = sum % 3;
      if (remainder == 0) {
        return hcpSum + quotient;
      }
      if (remainder == 1) {
        return (hcpSum + quotient) + "+";
      }
      if (remainder == 2) {
        return (hcpSum + quotient + 1) + "-";
      }
    } else {
      var sum = subtracts - addings;
      var quotient = ((subtracts - addings ) / 3) >> 0;
      var remainder = sum % 3;
      if (remainder == 0) {
        return hcpSum - quotient;
      }
      if (remainder == 1) {
        return (hcpSum - quotient) + "-";
      }
      if (remainder == 2) {
        return (hcpSum - quotient - 1) + "+";
      }
    }
    console.log(quotient)
    console.log(addings)
    console.log(subtracts)


  }

  hasCard(suit, card) {
    return suit[14 - card].selected;
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

calclualteAddings(suit): number {
  var sum = 0
  if (this.getSuitLength(suit) < 2)
  return 0;
  if (this.hasCard(suit, 14)) {
    sum += 1;
  }
  if (this.hasCard(suit, 10)) {
    sum += 1;
  }
  if (this.getSuitLength(suit) > 2) {
    if (this.hasCard(suit, 14) && (this.hcpInSuit(suit) == 6 || this.hcpInSuit(suit) == 5)) {
      sum = sum + 1;
    }
    if (this.hasCard(suit, 13) && (this.hcpInSuit(suit) == 4)) {
      sum = sum + 1;
    }
  }

  return sum;
}

  hcpInSuit(suit) {
    var hcp = 0;
    for (let index = 0; index < 4; index++) {
      if (suit[index].selected) {
        hcp += 4 - index;
      }
    }
    return hcp;
  }

calculateSubtracts(suit): number {
  var sum = 0
  if (this.getSuitLength(suit) < 2)
    return 0;
  if (this.getSuitLength(suit) == 2) {
    if ((this.hcpInSuit(suit) == 3) && !(this.hasCard(suit, 13))) {
      sum = sum + 2;
    }
    if ((this.hcpInSuit(suit) == 2)) {
      sum = sum + 2;
    }
    if (this.hcpInSuit(suit) == 1) {
      sum = sum + 1;
    }
  }
  if (this.getSuitLength(suit) == 3) {
    if (this.hcpInSuit(suit) == 1) {
      sum = sum + 1;
    }
  }
  if (this.hasCard(suit, 12)) {
    sum += 1;
  }
  if (this.hasCard(suit, 11)) {
    sum += 1;
  }
  if (this.hasCard(suit, 14) && this.hasCard(suit, 13)) {
    sum += 1;
  }
  return sum;
  }
}



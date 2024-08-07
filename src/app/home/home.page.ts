import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { KaplanrubenService } from '../kaplanruben.service';
import { TricktakingsourceService } from '../tricktakingsource.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  sqc: any = ["Too short", "Too short", "Too short", "Too short"];
  stoppers: any = [0, 0, 0, 0];
  cards: any = [];
  selectedCards: any = [];
  selected = 0;
  width = 600;
  height = 600;
  scale = ""
  suits = ["spade", "heart", "diamond", "club"];
  dpr: any;
  lp: any;
  ctr: any;
  spades: any[];
  hearts: any[];
  diamonds: any[];
  clubs: any[];
  Losers: number;
  MLosers: number;
  dt: any[];
  fnr: number;
  fp: number;
  cp: number;
  knr: number;
  ot: number;
  screen: any;
  handtype: string = "";
  shape: any;
  genericShape: any;
  ruleOf: any;
  hcpSum: any;
  dtSum: number;
  color: string[];
  colorIndex = 0;
  colors = [["#000000", "#E6180A", "#E6180A", "#000000"],
  ["#0000FF", "#FF0000", "#FFA500", "#00C000"],
  ["black", "red", "blue", "green"],
  ["green", "red", "yellow", "black"],
  ["black", "red", "orange", "blue"],
  ["black", "red", "yellow", "blue"],
  ["black", "red", "orange", "green"],
  ["black", "red", "yellow", "green"],
  ["blue", "red", "orange", "pink"],
  ["black", "orange", "yellow", "pink"]];
  qp: number;
  tts: any;
  constructor(public platform: Platform, private kaplanRubens: KaplanrubenService, private ttsService: TricktakingsourceService) {
    platform.ready().then(() => {
      console.log('Width: ' + platform.width());
      console.log('Height: ' + platform.height());
      console.log("Orientation:" + (platform.isPortrait() ? "Portait" : "Landscape"))
      this.screen = { "Width": this.platform.width(), "Height": this.platform.height(), "Orientation": (platform.isPortrait() ? "Portait" : "Landscape") }
    });
    this.color = this.colors[this.colorIndex];
  }
  ngOnInit(): void {
    var scale = 1;
    var height = 0;
    // The cards have a natural width of 169.075 and a height of 244.640.Its center is located at(+98.0375, +122.320). -- >
    // 13 card with overlay is using the space for 4 * 2 cards
    if (this.platform.isPortrait()) {
      // In portrait the desc takes the upper half, and the hand the bottome half
      scale = Math.round(10 * Math.min((this.platform.width() * 0.9) / (4 * 169.075), (this.platform.height() * 0.9) / (1.75 * 244.640))) / 10
      this.scale = "scale(" + scale + ")";
      console.log("scale = " + this.scale);
      this.width = (4 * 169.075) * scale;
      this.height = (2 * 244.640) * scale;
      height = (244.640 / 3);
      this.height = ((244.640) + 3 * height) * scale;
    }
    if (this.platform.isLandscape()) {
      // In landscape the desc takes the left half, and the hand the right half
      scale = Math.round(10 * Math.min((this.platform.width() * 0.9 / 2) / (4 * 169.075), (this.platform.height() * 0.9 / 2) / (1.75 * 244.640))) / 10
      this.scale = "scale(" + scale + ")";
      console.log("scale = " + this.scale);
      this.width = Math.min(this.platform.width() / 2, 1.1 * (4 * 169.075) * scale);
      this.height = Math.min(this.platform.height(), 1.1 * (2 * 244.640) * scale);
      console.log("Height = " + this.height);
      height = (244.640 / 3) * scale
    }
    this.updateStyleforSuit();
    for (let suit = 0; suit < 4; suit++) {
      for (let index = 14; index > 1; index--) {
        this.cards.push({ "name": "./assets/svg/svg-cards.svg#" + this.suits[suit] + "_" + index, "x": (580 - index * 40), "y": suit * height, "selected": false, "color": this.color[suit] });
      }
    }
  }

  updateStyleforSuit() {
    var sheet = document.createElement('style')
    sheet.innerHTML = ".spades { color: " + this.color[0] + "; }";
    sheet.innerHTML += ".hearts { color: " + this.color[1] + "; }";
    sheet.innerHTML += ".diamonds { color: " + this.color[2] + "; }";
    sheet.innerHTML += ".clubs { color: " + this.color[3] + "; }";
    document.body.appendChild(sheet);
  }

  colorSwitch() {
    this.colorIndex = (this.colorIndex + 1) % 10;
    this.color = this.colors[this.colorIndex];
    for (let suit = 0; suit < 4; suit++) {
      for (let index = 14; index > 1; index--) {
        console.log(this.cards[suit * 13 + index - 2])
        this.cards[suit * 13 + index - 2].color = this.color[suit];
      }
    }
    this.updateStyleforSuit();
  }

  selectCard(card) {
    console.log("selected: " + card.name);
    if (this.selected < 13 && !card.selected) {
      card.selected = true;
      card.orig = card.name;
      card.name = "./assets/svg/svg-cards.svg#back"
      this.selected++;
      this.updateSelectedCards();
    }
  }

  unSelectCard(card) {
    //console.log("selected: " + card.name);
    card.selected = false;
    card.name = card.orig;
    this.selected--;
    this.updateSelectedCards();
  }

  updateSelectedCards() {
    this.selectedCards = [];
    var count = 0;
    this.cards.forEach(card => {
      if (card.selected) {
        this.selectedCards.push(card);
        count++;
      }
    });
    //console.log(this.selectedCards);
    this.calculateHCP();
    this.calculateControls();
    this.findSuits();
    this.findSuitQualities();
    this.calculateDefensiveTricks();
    this.calculateOffensiveTricks();
    this.findHandType();
    this.calculateDistributionPoints();
    this.calculateLengthPoints();
    this.calculateLosers();
    this.calculateFreakness();
    this.calculateStoppers();
    this.calculateKNR();
    this.calculateTTS();
    this.calculateQP();
    this.calculateFP();
    this.calculateCP();
    if (count == 13) {
    }
  }

  calculateKNR() {
    // http://www.rpbridge.net/8j19.htm
    this.knr = this.kaplanRubens.calculateKNR(this.cards)
  }

  calculateStoppers() {
    // http://www.rpbridge.net/8j17.htm
    this.stoppers[0] = this.suitStopperCheck(this.spades, 0);
    this.stoppers[1] = this.suitStopperCheck(this.hearts, 1);
    this.stoppers[2] = this.suitStopperCheck(this.diamonds, 2);
    this.stoppers[3] = this.suitStopperCheck(this.clubs, 3);
  }

  suitStopperCheck(suit: any[], color: number) {
    var hcp = this.hcpInOneSuit(suit);
    if (hcp > 6) {
      return 2;
    }
    if (hcp == 6) {
      if (suit[0] == 14 && suit.length > 3) {
        return 2.0;
      }
      if (suit[0] == 14 && suit.length == 3 && suit[2] == 10) {
        return 2;
      }
      if (suit[0] == 14 && suit.length == 3) {
        return 1.5;
      }
      return 2;
    }
    if (hcp == 5) {
      if (suit[0] == 14 && suit.length > 3) {
        return 2.0;
      }
      if (suit[0] == 14 && suit.length == 3 && suit[2] == 10) {
        return 1.5;
      }
      if (suit[0] == 14 && suit.length == 3) {
        return 1;
      }
      if (suit.length == 3 && suit[2] == 10) {
        return 1.5;
      }
      return 2;
    }
    if (hcp == 4) {
      if (suit[0] == 14) {
        return 1.0;
      }
      if (suit.length == 3 && suit[2] == 10) {
        return 1.5;
      }
      if (suit.length > 3) {
        return 1.5;
      }
      return 1;
    }
    if (hcp == 3) {
      if (suit.length == 2) {
        return 0.5;
      }
      if (suit.length == 3) {
        if (suit[0] == 13 || suit[2] == 10) {
          return 1.0;
        }
        return 0.5;
      }
      if (suit.length > 3) {
        return 1;
      }
    }
    if (hcp == 2) {
      if (suit.length > 1 && suit.length < 4) {
        return 0.5;
      }
      if (suit.length > 3) {
        return 1;
      }
    }
    if (hcp == 1) {
      if (suit.length == 3) {
        return 0.5;
      }
      if (suit.length > 3) {
        return 1;
      }
    }
    return 0;
  }

  findSuitQualities() {
    this.sqc = [];
    this.sqc[0] = this.suitQualityCheck(this.spades)
    this.sqc[1] = this.suitQualityCheck(this.hearts)
    this.sqc[2] = this.suitQualityCheck(this.diamonds)
    this.sqc[3] = this.suitQualityCheck(this.clubs)
  }

  suitQualityCheck(suit: any[]) {
    var FirstCheck = this.suitQuality(suit);
    //console.log(FirstCheck)
    if (FirstCheck == "") {
      var newSuit = suit.slice(0, suit.length - 1);
      //console.log("New Suit: ", newSuit)
      for (let index = 0; index < 4; index++) {
        if (newSuit[index] != 14 - index) {
          newSuit.push(14 - index);
          break;
        }
      }
      newSuit.sort((a, b) => b - a)
      //console.log("New Suit: ", newSuit)
      FirstCheck = this.suitQuality(newSuit);
      if (FirstCheck == "Solid") {
        FirstCheck = "Semisolid"
      } else {
        FirstCheck = "Not solid"
      }
    }
    return FirstCheck;
  }

  suitQuality(suit: any[]) {
    var hcp = this.hcpInOneSuit(suit);
    //console.log(hcp);
    if (suit.length < 4) {
      return "Too short";
    }
    if (hcp == 10) {
      return "Solid";
    }
    if (hcp == 9 && suit.length > 6) {
      return "Solid";
    }
    if (hcp == 9 && suit.length == 6 && suit[3] == 10) {
      return "Solid";
    }
    if (hcp == 7 && suit.length > 9) {
      return "Solid";
    }
    if (hcp == 7 && suit.length == 9 && suit[1] == 13) {
      return "Solid";
    }
    if (hcp == 6 && suit.length > 9 && suit[0] == 14) {
      return "Solid";
    }
    if ((hcp == 4 || hcp == 5) && suit.length > 10 && suit[0] == 14) {
      return "Solid";
    }
    return "";
  }

  hcpInOneSuit(suit: any[]) {
    var hcp = 0;
    if (suit.indexOf(14) > -1) { hcp += 4 }
    if (suit.indexOf(13) > -1) { hcp += 3 }
    if (suit.indexOf(12) > -1) { hcp += 2 }
    if (suit.indexOf(11) > -1) { hcp += 1 }
    return hcp;
  }

  calculateOffensiveTricks() {
    //K, Q - x, K - x, J - 10 - x, Q - x - x	0.5
    //A, K - J, K - Q, A - x, Q - J - x, K - x - x, A - x - x	1
    //A - J, A - Q, K - J - 10, K - Q - x, A - J - x, A - Q - x	1.5
    //A - K, K - Q - J, A - Q - 10, A - K - x	2
    //A - Q - J, A - K - J	2.5
    //A - K - Q	3
    this.ot = 0;
    for (let suit = 0; suit < 4; suit++) {
      var thisSuit = this.getSuit(suit);
      if (this.sqc[suit] == "Solid") {
        this.ot += thisSuit.length;
      } else
        if (this.sqc[suit] == "Semisolid") {
          this.ot += thisSuit.length - 0.5;
        } else {
          if (thisSuit.length > 3) {
            this.ot += thisSuit.length - 3;
          }
          var hcp = this.hcpInSuit(suit);
          if (hcp > 8) {
            this.ot += 3;
          } else {
            this.ot += this.dt[suit];
          }
        }
    }


  }

  findHandType() {
    this.handtype = "";
    var suitLengths = [this.spades.length, this.hearts.length, this.diamonds.length, this.clubs.length]
    suitLengths.sort(function (a, b) {
      return b - a;
    });
    this.genericShape = "" + suitLengths[0] + suitLengths[1] + suitLengths[2] + suitLengths[3];
    this.shape = "" + this.spades.length + "=" + this.hearts.length + "=" + this.diamonds.length + "=" + this.clubs.length;
    this.ruleOf = this.hcpSum + suitLengths[0] + suitLengths[1];
    if (suitLengths[0] == 8 && suitLengths[1] == 5) {
      this.handtype = "Two suited";
      return;
    }
    if (suitLengths[0] == 7 && suitLengths[1] > 3) {
      this.handtype = "Two suited";
      return;
    }
    if (suitLengths[0] == 6) {
      if (suitLengths[1] > 4) {
        this.handtype = "Two suited";
        return;
      } else {
        if (suitLengths[2] == 2) {
          this.handtype = "Semi balanced (Single suited)";
          return;
        } else {
          this.handtype = "Semi balanced (Single suited)";
        }
      }
    }
    if (suitLengths[0] == 5) {
      if (suitLengths[1] == 5) {
        this.handtype = "Two suited";
        return;
      } else {
        if (suitLengths[1] == 4) {
          if (suitLengths[2] > 2) {
            this.handtype = "Three suited";
            return;
          } else {
            this.handtype = "Balanced (Two suited)";
            return;
          }
        }
      }
    }
    if (suitLengths[0] == 4) {
      if (suitLengths[3] == 1) {
        this.handtype = "Three suited (Marmic)";
        return;
      } else {
        this.handtype = "Balanced";
        return;
      }
    }
    this.handtype = "Single suited";
  }

  calculateFreakness() {
    this.fnr = 0;
    if (this.spades.length > 4) { this.fnr += this.spades.length - 4 }
    if (this.hearts.length > 4) { this.fnr += this.hearts.length - 4 }
    if (this.diamonds.length > 4) { this.fnr += this.diamonds.length - 4 }
    if (this.clubs.length > 4) { this.fnr += this.clubs.length - 4 }
    if (this.spades.length < 3) { this.fnr += 3 - this.spades.length }
    if (this.hearts.length < 3) { this.fnr += 3 - this.hearts.length }
    if (this.diamonds.length < 3) { this.fnr += 3 - this.diamonds.length }
    if (this.clubs.length < 3) { this.fnr += 3 - this.clubs.length }
    if (this.spades.length == 0 || this.hearts.length == 0 || this.diamonds.length == 0 || this.clubs.length == 0) {
      this.fnr += 2;
    } else {
      if (this.spades.length == 1 || this.hearts.length == 1 || this.diamonds.length == 1 || this.clubs.length == 1) {
        this.fnr += 1;
      }
    }
  }

  calculateLosers() {
    this.Losers = 0;
    this.calculateLoserCount(this.spades)
    this.calculateLoserCount(this.hearts)
    this.calculateLoserCount(this.diamonds)
    this.calculateLoserCount(this.clubs)
  }

  calculateLoserCount(suit) {
    if (suit.length > 0) {
      if (suit[0] != 14) {
        this.Losers++;
        this.MLosers += 1.5 ;
      }
    }
    if (suit.length > 1) {
      if (suit[0] != 13 && suit[1] != 13) {
        this.Losers++;
        this.MLosers++;
      }
    }
    if (suit.length > 2) {
      if (suit[0] != 12 && suit[1] != 12 && suit[2] != 12) {
        this.Losers++;
        this.MLosers += 0.5;
      }
    }
  }

  calculateDefensiveTricks() {
    this.dt = [0, 0, 0, 0];
    this.dtSum = 0;
    this.dt[0] = this.calculateDefensiveTrick(this.spades)
    this.dt[1] = this.calculateDefensiveTrick(this.hearts)
    this.dt[2] = this.calculateDefensiveTrick(this.diamonds)
    this.dt[3] = this.calculateDefensiveTrick(this.clubs)
    this.dtSum = this.dt[0] + this.dt[1] + this.dt[2] + this.dt[3]
  }

  calculateDefensiveTrick(suit) {
    var dt = 0;
    if (suit.length == 0) { return dt; }
    if (suit.length == 1) {
      if (suit[0] == 14) {
        dt++;
      }
      if (suit[0] == 13) {
        dt += 0.5;
      }
    } else {
      if (suit[0] == 14 && suit[1] == 13) {
        dt += 2;
      }
      if (suit[0] == 14 && suit[1] == 12) {
        dt += 1.5;
      }
      if (suit[0] == 14 && suit[1] < 12) {
        dt += 1;
      }
      if (suit[0] == 13 && suit[1] == 12) {
        dt += 1;
      }
      if (suit[0] == 13 && suit[1] != 12) {
        dt += 0.5;
      }
    }
    return dt;
  }

  calculateControls() {
    this.ctr = 0;
    for (let suit = 0; suit < 4; suit++) {
      for (let index = 0; index < 2; index++) {
        if (this.cards[(suit) * 13 + index].selected) {
          this.ctr = this.ctr + 2 - index;
        }
      }
    }
    //console.log("Controls=", this.ctr);
  }

  findSuits() {
    this.spades = this.getSuit(0);
    this.hearts = this.getSuit(1);
    this.diamonds = this.getSuit(2);
    this.clubs = this.getSuit(3);
  }

  getSuit(suit) {
    var suitArray = [];
    for (let index = 0; index < 13; index++) {
      //console.log((suit) * 13 + index)
      if (this.cards[(suit) * 13 + index].selected) {
        suitArray.push(14 - index);
      }
    }
    return suitArray;
  }

  calculateDistributionPoints() {
    this.dpr = 0;
    if (this.spades.length < 3) {
      this.dpr = this.dpr + (3 - this.spades.length)
    }
    if (this.hearts.length < 3) {
      this.dpr = this.dpr + (3 - this.hearts.length)
    }
    if (this.diamonds.length < 3) {
      this.dpr = this.dpr + (3 - this.diamonds.length)
    }
    if (this.clubs.length < 3) {
      this.dpr = this.dpr + (3 - this.clubs.length)
    }
  }

  calculateLengthPoints() {
    this.lp = 0;
    if (this.spades.length > 4) {
      this.lp = this.lp + this.spades.length - 4
    }
    if (this.hearts.length > 4) {
      this.lp = this.lp + this.hearts.length - 4
    }
    if (this.diamonds.length > 4) {
      this.lp = this.lp + this.diamonds.length - 4
    }
    if (this.clubs.length > 4) {
      this.lp = this.lp + this.clubs.length - 4
    }
  }

  calculateHCP() {
    this.hcpSum = 0;
    for (let suit = 0; suit < 4; suit++) {
      this.hcpSum += this.hcpInSuit(suit);
    }
  }

  calculateFP() {
    this.fp = -2;
    var suitLengths = [this.spades.length, this.hearts.length, this.diamonds.length, this.clubs.length]
    suitLengths.sort(function (a, b) {
      return b - a;
    });
    for (let suit = 0; suit < 4; suit++) {
      this.fp += this.fpInSuit(this.getSuit(suit));
    }
    if (suitLengths[0] > 5 && suitLengths[1] > 4) {
      this.fp += (suitLengths[0] + suitLengths[1] - 10) * 0.5;
    }
    var doubleton = 0;
    for (let suit = 0; suit < 4; suit++) {
      if (this.getSuit(suit).length == 2) {
        doubleton += 1;
      };
    }
    if (doubleton == 2) {
      this.fp += 0.5
    }
    this.fp += this.fpAdjust();
  }

  private fpInSuit(suit: any): number {
    var fp = 0;
    if (suit.length == 0) {
      return 1
    }
    if (suit.length == 1) {
      if (suit[0] == 14) {
        return 2
      }
      return 0.5;
    }
    if (this.genericShape == "7222") {
      fp += 0.5;
    }
    if (suit.length > 6 && this.hcpInOneSuit(suit) > 0) {
      fp = (suit.length - 6) * 0.5;
    }
    if (suit[0] == 14)
      if (suit[1] == 13) {
        if (suit[2] == 12) {
          return fp + 3
        } else {
          return fp + 2.5
        }
      } else {
        if (suit[1] == 12) {
          return fp + 2
        } else {
          return fp + 1.5
        }
      }
    if (suit[0] == 13) {
      if (suit[1] == 12) {
        return fp + 1.5
      } else {
        return fp + 1
      }
    }
    if (suit[0] == 12) {
      return fp + 0.5
    }
    return fp;
  }

  calculateCP() {
    this.cp = 0;
    for (let suit = 0; suit < 4; suit++) {
      this.cp += this.cpInSuit(this.getSuit(suit));
    }
  }

  private cpInSuit(suit: any) {
    if (suit.length == 0) {
      return 6;
    }
    if (suit.length == 1) {
      if (suit[0] == 14) {
        return 6
      }
      return 4;
    }
    if (suit[0] == 14)
      if (suit[1] == 13) {
        return 10
      } else {
        return 6
      }
    if (suit[0] == 13) {
      return 4
    }
    return 0;
  }

  calculateQP() {
    this.qp = 0;
    for (let suit = 0; suit < 4; suit++) {
      this.qp += this.qpInSuit(suit);
    }
  }

  private hcpInSuit(suit: number) {
    var hcp = 0;
    for (let index = 0; index < 4; index++) {
      if (this.cards[(suit) * 13 + index].selected) {
        hcp += 4 - index;
      }
    }
    return hcp;
  }

  private qpInSuit(suit: number) {
    var hcp = 0;
    for (let index = 0; index < 4; index++) {
      if (this.cards[(suit) * 13 + index].selected) {
        hcp += 3 - index;
      }
    }
    return hcp;
  }

  private calculateTTS() {
    this.tts = this.ttsService.calculateTTS(this.cards, this.hcpSum);
    console.log("TTS: " + this.tts);
  }

  private fpAdjust() {
    return 0;
  }
}


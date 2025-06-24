import { NgModule } from "@angular/core";
import { ThemeService } from "ng2-charts";
import { MyErrorStateMatcher } from "./error-state-matcher/error-state-matcher";

@NgModule({
    declarations: [
    ],
    imports: [
    ],
    providers: [
        MyErrorStateMatcher,ThemeService
    ],
    bootstrap: []
  })
  export class HelperModule { }
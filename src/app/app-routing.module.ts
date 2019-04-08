import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'overview', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'overview', loadChildren: './overview/overview.module#OverviewPageModule' },
  { path: 'add-income', loadChildren: './add-income/add-income.module#AddIncomePageModule' },
  { path: 'add-expense', loadChildren: './add-expense/add-expense.module#AddExpensePageModule' },
  { path: 'edit-ledger', loadChildren: './edit-ledger/edit-ledger.module#EditLedgerPageModule' },
  { path: 'create-account', loadChildren: './create-account/create-account.module#CreateAccountPageModule' },
  { path: 'intro', loadChildren: './intro/intro.module#IntroPageModule' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'select-an-account', loadChildren: './select-an-account/select-an-account.module#SelectAnAccountPageModule' },
  { path: 'snapclerk', loadChildren: './snapclerk/snapclerk.module#SnapclerkPageModule' },
  { path: 'view-attachment', loadChildren: './view-attachment/view-attachment.module#ViewAttachmentPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

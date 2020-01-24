import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule as NgRouterModule } from '@angular/router';
import { UpgradeModule as NgUpgradeModule } from '@angular/upgrade/static';
import { CoreModule, RouterModule, HOOK_ONCE_ROUTE, HOOK_NAVIGATOR_NODES, ViewContext, NavigatorNode} from '@c8y/ngx-components';
import { UpgradeModule, HybridAppModule, UPGRADE_ROUTES } from '@c8y/ngx-components/upgrade';
import { AssetsNavigatorModule } from '@c8y/ngx-components/assets-navigator';
import { OpcuaProtocolModule } from '@c8y/ngx-components/protocol-opcua';


@NgModule({
  imports: [
    BrowserAnimationsModule,
    RouterModule.forRoot(),
    NgRouterModule.forRoot([
        ...UPGRADE_ROUTES,
    ], { enableTracing: false, useHash: true }),
    CoreModule.forRoot(),
    AssetsNavigatorModule.config({
      smartGroups: true
    }),
    OpcuaProtocolModule,
    NgUpgradeModule,
    // Upgrade module must be the last
    UpgradeModule
  ],
   declarations: [],
   entryComponents: [],
   providers: [
    {
      provide: HOOK_ONCE_ROUTE,
      useValue: [{
        context: ViewContext.Device,
        //path and component are shell, this is to reuse code form the original implementation
        //from cumulocity. 
        path: 'shell',
        component: 'shell',
        label: 'My Custom Shell',
        priority: 999,
        icon: 'terminal'
      }],
      multi: true
    }
  ]
})
export class AppModule extends HybridAppModule {
  constructor(protected upgrade: NgUpgradeModule) {
    super();
  }
}

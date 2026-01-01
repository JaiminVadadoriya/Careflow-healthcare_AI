import { Injectable, ApplicationRef, Injector, ComponentRef, EnvironmentInjector, createComponent } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private componentRef: ComponentRef<any> | null = null;

  constructor(
    private appRef: ApplicationRef,
    private injector: Injector,
    private environmentInjector: EnvironmentInjector
  ) {}

  open(component: any, config?: { data?: any }): ModalRef {
    const modalRef = new ModalRef();

    // Create the component
    this.componentRef = createComponent(component, {
      environmentInjector: this.environmentInjector,
      elementInjector: this.injector
    });

    // Pass data if available
    if (config?.data && this.componentRef.instance) {
      this.componentRef.instance.data = config.data;
    }
    
    // Pass modalRef so component can close itself
    if (this.componentRef.instance) {
      this.componentRef.instance.modalRef = modalRef;
    }

    // Attach to the view
    this.appRef.attachView(this.componentRef.hostView);
    const domElem = (this.componentRef.hostView as any).rootNodes[0] as HTMLElement;
    
    // Add Tailwind Overlay classes
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in';
    overlay.appendChild(domElem);

    document.body.appendChild(overlay);

    // Handle Close
    modalRef.afterClosed().subscribe(() => {
      this.appRef.detachView(this.componentRef!.hostView);
      this.componentRef!.destroy();
      document.body.removeChild(overlay);
      this.componentRef = null;
    });

    return modalRef;
  }
}

export class ModalRef {
  private afterClosedSubject = new Subject<any>();

  close(result?: any) {
    this.afterClosedSubject.next(result);
    this.afterClosedSubject.complete();
  }

  afterClosed() {
    return this.afterClosedSubject.asObservable();
  }
}

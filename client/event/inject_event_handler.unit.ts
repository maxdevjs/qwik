/**
 * @license
 * Copyright a-Qoot All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/a-Qoot/qoot/blob/main/LICENSE
 */

import { expect } from 'chai';
import { AttributeMarker } from '../util/markers.js';
import { Component } from '../component/index.js';
import { QRL } from '../import/qrl.js';
import { ElementFixture } from '../testing/element_fixture.js';
import { EventInjector } from './event_injector.js';
import { injectEventHandler } from './inject_event_handler.js';
import { EventService } from './event_service.js';

describe('injectEventHandler', () => {
  let fixture: ElementFixture;
  beforeEach(() => (fixture = new ElementFixture()));

  it('should support component injection', async () => {
    const event = 'EVENT' as any as Event;
    const url = new URL('http://localhost/path?a=b&c=d');
    fixture.host.setAttribute(AttributeMarker.ComponentTemplate, String(MyComponent.$templateQRL));

    const fn = injectEventHandler(
      MyComponent,
      async (injector: EventInjector) => {
        const eventService = await injector.getService(EventService.KEY);
        expect(injector.element).to.equal(fixture.host);
        expect(eventService.event).to.equal(event);
        expect(eventService.url).to.equal(url);
        return 'providerValue';
      },
      function (this: MyComponent, arg0: string) {
        expect(this.$host).to.equal(fixture.host);
        expect(arg0).to.equal('providerValue');
        return 'handlerValue';
      }
    );
    expect(await fn(fixture.host, event, url)).to.equal('handlerValue');
  });
});

class MyComponent extends Component<any, any> {
  static $templateQRL: QRL = 'myComponentQRL' as any;
  $newState() {
    return {};
  }
}
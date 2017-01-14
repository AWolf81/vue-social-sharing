import Vue from 'vue';
import SocialSharing, { mockWindow, networks } from '../../src/social-sharing';
import SocialSharingMixin from '../../src/social-sharing-mixin';

const getNestedComponent = (vm, refIn) => {
  // refIn = component.directShare --> return vm.$refs.component.$refs.directShare;
  const keys = refIn.split('.');
  let refOut = vm;

  keys.forEach((key) => {
    refOut = refOut.$refs[key];
  });

  return refOut;
  //vm.$refs.component.$refs.directShare;
}

describe('SocialSharing', () => {
  const createComponent = (propsData = {}, attr = {}, mixins = SocialSharingMixin.popup) => {
    const Ctor = Vue.extend({
      template: `
        <social-sharing ref="component"
          inline-template>
          <div class="icons">
            <facebook class="icon">
              <i class="fa fa-facebook"></i>
            </facebook>
            <twitter class="icon">
              <i class="fa fa-twitter"></i>
              </twitter>
            <linkedin class="icon">
              <i class="fa fa-linkedin"></i>
            </linkedin>
            <whatsapp ref="directShare"></whatsapp>
          </div>
        </social-sharing>
      `,
      mixins: [mixins],
      components: {
        SocialSharing
      }
    });

    return new Ctor({
      propsData,
      data () {
        return {
          attr
        };
      }
    }); // .$mount();
  };

  // Inspect the raw component options
  it('has a mounted method', () => {
    expect(typeof SocialSharing.mounted).toBe('function');
  });

  // Evaluate the results of functions in
  // the raw component options
  it('sets the correct default data', () => {
    expect(typeof SocialSharing.data).toBe('function');
    const defaultData = SocialSharing.data();
    expect(typeof defaultData.networks).toBe('object');
  });

  // Calculates correct position of popup
  it('calculates correct popup position', (done) => {
    mockWindow({
      screen: {
        width: 1000,
        height: 700
      },
      location: {
        href: window.location.href
      }
    });

    const comp = new Vue({
      el: document.createElement('div'),
      render: (h) => h(SocialSharing)
    });

    Vue.nextTick(() => {
      // console.log('data', comp);
      const popup = comp.$children[0].popup;
      // default width popup = 626
      // default height popup = 436
      expect(popup.left).toBe(177); // 1000 /2 - ((626/2) + 10) = 177
      expect(popup.top).toBe(82); // 700 / 2 - ((436/2) + 50) = 82
      done();
    });
  });

  xit('should get correct sharer url', () => {
  });

  xit('should open popup', () => {
  });

  xit('should set component aliases correctly', (done) => {
    // not working yet --> how to handle multiple nextTick handlers?
    const componentNames = Object.keys(networks);
    let index = 0;

    const newComponent = (name) => {
      const Ctor = Vue.extend(SocialSharing);
      return new Ctor({
        template: `<${name}></${name}>`
      });
    };
    

    const vm = newComponent(componentNames[index]).$mount();
    // expect(component.popup.template).toBe(expectedInstance.template); // correct mixin applied?
    vm.$nextTick(() => {
    //   let expectedInstance = name !== 'whatsapp' ? SocialSharingMixin.popup : SocialSharingMixin.direct;
    //   console.log(component.$children[0].$data.network, name);
    //   // expect(components.$children[0].$data.network).toBe(name); // correct network name?
      console.log(vm);
      expect(true).toBeTruthy();
      done();
    })


  });

  // mixin tests
  it('should render sharing links correctly', () => {
    // not working in travis-ci yet
    const expectedShareNames = [
      'facebook',
      'twitter',
      'linkedin'
    ];

    const vm = createComponent().$mount();
    const iconLinks = vm.$el.querySelectorAll('.icon');

    iconLinks.forEach((link, index) => {
      expect(link.href.split('#')[1]).toBe(`share-${expectedShareNames[index]}`); // split to remove http://domain.com/#share-twitter
    });
  });

  it('direct share should get attribute by key', (done) => {
    const attr = {
      'data-action': 'share/whatsapp/share'
    };
    const propsData = {};
    const propKeys = Object.keys(attr);
    const vm = createComponent(propsData, attr).$mount();
    const component = getNestedComponent(vm, 'component.directShare'); //vm.$refs.component.$refs.directShare;

    Vue.nextTick(() => {
      propKeys.forEach((key) => {
        expect(component.attributes(key)).toBe(attr[key]);
      });
      done();
    });
  });
});

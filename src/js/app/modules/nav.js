import Module from '../module';

export default class Nav extends Module {
  constructor() {
    super();
    this.content = this.find('nav');
    this.button = this.find('.toggle-nav');
    this.buttonParts = this.find('.icon-part');
    this.navButtons = this.find('.nav-item');
    this.wrapper= this.find('.header-nav-wrapper');
    this.slideSpeed = 'slow';
    this.buttonStateId = 'aria-pressed';
    this.contentStateId = 'aria-expanded';
    this.buttonStateVariants = [
      'nav-close',
      'nav-open',
    ];
    this.wrapperStateVariants = [
      'scrolling',
    ];
    this.wrapperChangePosition = 50;
  }

  setState(element, stateId, state) {
    element.attr(stateId, state);
  }

  getState(element, stateId) {
    return element.attr(stateId) === 'false'? false: true;
  }

  toggleButtonClass(button) {
    button.hasClass(this.buttonStateVariants[1])?
      (
        button.removeClass(this.buttonStateVariants[1]),
        button.addClass(this.buttonStateVariants[0])
      ):
      (
        button.addClass(this.buttonStateVariants[1]),
        button.removeClass(this.buttonStateVariants[0])
      );
  }

  toggleButtonView() {
    this.getState(this.button, this.buttonStateId)?
    this.animateButtonParts():
    this.reverseAnimateButtonParts();
  }

  animateButtonParts() {
    $(this.buttonParts[0]).velocity('stop').velocity({translateY: '8px',rotateZ: '135deg'},{duration: 300});
    $(this.buttonParts[1]).velocity('stop').velocity({translateX: '-40px',opacity: 0},{duration: 300});
    $(this.buttonParts[2]).velocity('stop').velocity({translateY: '-8px', rotateZ: '-135deg'},{duration: 300,
    complete: () => {
      this.button.on('click', this.handleButtonClick.bind(this));
    }});
  }

  reverseAnimateButtonParts() {
    this.buttonParts.velocity(
      'reverse',
      { complete: () => { this.button.on('click', this.handleButtonClick.bind(this)) } }
    );
  }

  toggleButton(button) {
    this.getState(button, this.buttonStateId)?
    this.setState(button, this.buttonStateId, false):
    this.setState(button, this.buttonStateId, true);
  }

  handleButtonClick() {
    this.button.off('click');
    this.toggleButton(this.button);
    this.toggleButtonClass(this.button);
    this.toggleButtonView();
    this.toggleContent();
  }

  toggleContent(bp) {
    this.getState(this.content, this.contentStateId)?
    this.setState(this.content, this.contentStateId, false):
    this.setState(this.content, this.contentStateId, true);
    bp?
    (
      $(window).width() < bp? this.content.slideToggle(this.slideSpeed): false
    ):
    this.content.slideToggle(this.slideSpeed);
  }

  handleNavButtonsClick(e) {
    const button = $(e.currentTarget),
          target = $('#' + e.currentTarget.innerText.trim().toLowerCase());
    this.setAllNavButtonPressedState(false);
    this.toggleButton(button);
    target.velocity('stop').velocity('scroll', {duration: 2000, offset: -60, easing: 'easeInOutCubic'});
    this.toggleContent(768);
    $(window).width() < 768?
    (
      this.button.off('click'),
      this.toggleButton(this.button),
      this.toggleButtonClass(this.button),
      this.toggleButtonView()
    ):
    false;
  }

  setAllNavButtonPressedState(state) {
    this.setState(this.navButtons, this.buttonStateId, state);
  }

  getScrollPosition() {
    return (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0);
  }

  toggleWrapper() {
    this.getScrollPosition() > this.wrapperChangePosition?
      this.wrapper.hasClass(this.wrapperStateVariants[0])?
      false: this.wrapper.addClass(this.wrapperStateVariants[0]):
    this.wrapper.removeClass(this.wrapperStateVariants[0]);
  }

  init() {
    this.registerDomEvent(window, 'scroll', this.toggleWrapper.bind(this));
    this.registerDomEvent('.toggle-nav', 'click', this.handleButtonClick.bind(this));
    this.registerDomEvent('.nav-item', 'click', this.handleNavButtonsClick.bind(this));
  };
}

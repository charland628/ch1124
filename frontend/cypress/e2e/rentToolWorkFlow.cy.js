describe('My First Test', () => {
    const LINK_HOME = '[id="nav-link-home"]';
    const LINK_FORM = '[id="nav-link-rental-form"]';
    const RENTAL_FORM_HEADER = '[id="rental-form-header"]';
    const RENTAL_FORM_DESC = '[id="rental-form-desc"]';
    const RENTAL_FORM_FIELD_SELECT = '[id="select-tool"]';
    const RENTAL_FORM_FIELD_DATE_CHECKOUT = '[id="input-checkout-date"]';
    const RENTAL_FORM_FIELD_DATE_RETURN = '[id="input-return-date"]';
    const RENTAL_FORM_FIELD_DISCOUNT = '[id="input-discount-amount"]';
    const RENTAL_FORM_CHECKOUT_BTN = '[id="checkout-btn"]';
    const RENTAL_FORM_WARNING_DISCOUNT = '[id="invalid-feedback-input-discount-amount"]';
    const RENTAL_AGREEMENT_HEADER = '[id="rental-agreement-header"]';
    const RENTAL_AGREEMENT_TOOL_CODE = '[id="rental-tool-code"]';
    const RENTAL_AGREEMENT_TOOL_TYPE = '[id="rental-tool-type"]';
    const RENTAL_AGREEMENT_TOOL_BRAND = '[id="rental-tool-brand"]';
    const RENTAL_AGREEMENT_DATE_CHECKOUT = '[id="rental-checkout-date"]';
    const RENTAL_AGREEMENT_DATE_RETURN = '[id="rental-return-date"]';
    const RENTAL_AGREEMENT_DAILY_CHARGE = '[id="rental-daily-charge"]';
    const RENTAL_AGREEMENT_CHARGEABLE_DAYS = '[id="rental-chargeable-days"]';
    const RENTAL_AGREEMENT_SUBTOTAL = '[id="rental-prediscount-amount"]';
    const RENTAL_AGREEMENT_DISCOUNT_PERCENT = '[id="rental-discount-percent"]';
    const RENTAL_AGREEMENT_DISCOUNT_AMOUNT = '[id="rental-discount-amount"]';
    const RENTAL_AGREEMENT_TOTAL = '[id="rental-final-amount"]';

    beforeEach(() => {
        cy.intercept('GET', '/getTools', { fixture: 'tools.json' });
        cy.intercept('GET', '/getToolCharges', { fixture: 'toolCharges.json' });
        cy.visit('/');
        cy.contains('Welcome to Rent-a-Tool');
        cy.get(LINK_HOME).should('be.visible');
        cy.get(LINK_HOME).contains('Home');
        cy.get(LINK_FORM).should('be.visible');
        cy.get(LINK_FORM).contains('Point of Sale Rental Form');
        cy.get(LINK_FORM).click();
        cy.get(RENTAL_FORM_HEADER).contains('Point of Sale Rent-a-Tool Form');
        cy.get(RENTAL_FORM_DESC).should('exist');
        cy.wait(3000);
    });

    it('end to end test #1:  JAKR   9/3/15   9/8/15   101%', () => {
        cy.get(RENTAL_FORM_FIELD_DATE_RETURN).type('2015-09-08');
        cy.get(RENTAL_FORM_FIELD_DATE_CHECKOUT).type('2015-09-03');
        cy.get(RENTAL_FORM_FIELD_DISCOUNT).type(101);
        cy.get(RENTAL_FORM_FIELD_SELECT).select('JAKR');

        cy.get(RENTAL_FORM_CHECKOUT_BTN).click();
        cy.get(RENTAL_FORM_WARNING_DISCOUNT).contains('Discount percentage must be a whole number between 0 and 100.');
    });

    it('end to end test #2:  LADW   7/2/20   7/4/20   10%', () => {
        cy.get(RENTAL_FORM_FIELD_DATE_RETURN).type('2020-07-04');
        cy.get(RENTAL_FORM_FIELD_DATE_CHECKOUT).type('2020-07-02');
        cy.get(RENTAL_FORM_FIELD_DISCOUNT).type(10);
        cy.get(RENTAL_FORM_FIELD_SELECT).select('LADW');

        cy.get(RENTAL_FORM_CHECKOUT_BTN).click();
        cy.get(RENTAL_AGREEMENT_HEADER).contains('Rental Agreement');
        cy.get(RENTAL_AGREEMENT_TOOL_CODE).contains('LADW');
        cy.get(RENTAL_AGREEMENT_TOOL_TYPE).contains('ladder');
        cy.get(RENTAL_AGREEMENT_TOOL_BRAND).contains('Werner');
        cy.get(RENTAL_AGREEMENT_DATE_CHECKOUT).contains('07/02/20');
        cy.get(RENTAL_AGREEMENT_DATE_RETURN).contains('07/04/20');
        cy.get(RENTAL_AGREEMENT_DAILY_CHARGE).contains('$1.99');
        cy.get(RENTAL_AGREEMENT_CHARGEABLE_DAYS).contains('1');
        cy.get(RENTAL_AGREEMENT_SUBTOTAL).contains('$1.99');
        cy.get(RENTAL_AGREEMENT_DISCOUNT_PERCENT).contains('10%');
        cy.get(RENTAL_AGREEMENT_DISCOUNT_AMOUNT).contains('$0.20');
        cy.get(RENTAL_AGREEMENT_TOTAL).contains('$1.79');
    });

    it('end to end test #3:  CHNS   7/2/15   7/7/15   10%', () => {
        cy.get(RENTAL_FORM_FIELD_DATE_RETURN).type('2015-07-07');
        cy.get(RENTAL_FORM_FIELD_DATE_CHECKOUT).type('2015-07-02');
        cy.get(RENTAL_FORM_FIELD_DISCOUNT).type(25);
        cy.get(RENTAL_FORM_FIELD_SELECT).select('CHNS');

        cy.get(RENTAL_FORM_CHECKOUT_BTN).click();
        cy.get(RENTAL_AGREEMENT_HEADER).contains('Rental Agreement');
        cy.get(RENTAL_AGREEMENT_TOOL_CODE).contains('CHNS');
        cy.get(RENTAL_AGREEMENT_TOOL_TYPE).contains('chainsaw');
        cy.get(RENTAL_AGREEMENT_TOOL_BRAND).contains('Stihl');
        cy.get(RENTAL_AGREEMENT_DATE_CHECKOUT).contains('07/02/15');
        cy.get(RENTAL_AGREEMENT_DATE_RETURN).contains('07/07/15');
        cy.get(RENTAL_AGREEMENT_DAILY_CHARGE).contains('$1.49');
        cy.get(RENTAL_AGREEMENT_CHARGEABLE_DAYS).contains('3');
        cy.get(RENTAL_AGREEMENT_SUBTOTAL).contains('$4.47');
        cy.get(RENTAL_AGREEMENT_DISCOUNT_PERCENT).contains('25%');
        cy.get(RENTAL_AGREEMENT_DISCOUNT_AMOUNT).contains('$1.12');
        cy.get(RENTAL_AGREEMENT_TOTAL).contains('$3.35');
    });

    it('end to end test #4:  JAKD   9/3/15   9/9/15   0%', () => {
        cy.get(RENTAL_FORM_FIELD_DATE_RETURN).type('2015-09-09');
        cy.get(RENTAL_FORM_FIELD_DATE_CHECKOUT).type('2015-09-03');
        cy.get(RENTAL_FORM_FIELD_DISCOUNT).type(0);
        cy.get(RENTAL_FORM_FIELD_SELECT).select('JAKD');

        cy.get(RENTAL_FORM_CHECKOUT_BTN).click();
        cy.get(RENTAL_AGREEMENT_HEADER).contains('Rental Agreement');
        cy.get(RENTAL_AGREEMENT_TOOL_CODE).contains('JAKD');
        cy.get(RENTAL_AGREEMENT_TOOL_TYPE).contains('jackhammer');
        cy.get(RENTAL_AGREEMENT_TOOL_BRAND).contains('DeWalt');
        cy.get(RENTAL_AGREEMENT_DATE_CHECKOUT).contains('09/03/15');
        cy.get(RENTAL_AGREEMENT_DATE_RETURN).contains('09/09/15');
        cy.get(RENTAL_AGREEMENT_DAILY_CHARGE).contains('$2.99');
        cy.get(RENTAL_AGREEMENT_CHARGEABLE_DAYS).contains('3');
        cy.get(RENTAL_AGREEMENT_SUBTOTAL).contains('$8.97');
        cy.get(RENTAL_AGREEMENT_DISCOUNT_PERCENT).contains('0%');
        cy.get(RENTAL_AGREEMENT_DISCOUNT_AMOUNT).contains('$0.00');
        cy.get(RENTAL_AGREEMENT_TOTAL).contains('$8.97');
    });

    it('end to end test #5:  JAKR   7/2/15   7/11/15   0%', () => {
        cy.get(RENTAL_FORM_FIELD_DATE_RETURN).type('2015-07-11');
        cy.get(RENTAL_FORM_FIELD_DATE_CHECKOUT).type('2015-07-02');
        cy.get(RENTAL_FORM_FIELD_DISCOUNT).type(0);
        cy.get(RENTAL_FORM_FIELD_SELECT).select('JAKR');

        cy.get(RENTAL_FORM_CHECKOUT_BTN).click();
        cy.get(RENTAL_AGREEMENT_HEADER).contains('Rental Agreement');
        cy.get(RENTAL_AGREEMENT_TOOL_CODE).contains('JAKR');
        cy.get(RENTAL_AGREEMENT_TOOL_TYPE).contains('jackhammer');
        cy.get(RENTAL_AGREEMENT_TOOL_BRAND).contains('Ridgid');
        cy.get(RENTAL_AGREEMENT_DATE_CHECKOUT).contains('07/02/15');
        cy.get(RENTAL_AGREEMENT_DATE_RETURN).contains('07/11/15');
        cy.get(RENTAL_AGREEMENT_DAILY_CHARGE).contains('$2.99');
        cy.get(RENTAL_AGREEMENT_CHARGEABLE_DAYS).contains('6');
        cy.get(RENTAL_AGREEMENT_SUBTOTAL).contains('$17.94');
        cy.get(RENTAL_AGREEMENT_DISCOUNT_PERCENT).contains('0%');
        cy.get(RENTAL_AGREEMENT_DISCOUNT_AMOUNT).contains('$0.00');
        cy.get(RENTAL_AGREEMENT_TOTAL).contains('$17.94');
    });

    it('end to end test #6:  JAKR   7/2/20   7/6/20   50%', () => {
        cy.get(RENTAL_FORM_FIELD_DATE_RETURN).type('2020-07-06');
        cy.get(RENTAL_FORM_FIELD_DATE_CHECKOUT).type('2020-07-02');
        cy.get(RENTAL_FORM_FIELD_DISCOUNT).type(50);
        cy.get(RENTAL_FORM_FIELD_SELECT).select('JAKR');

        cy.get(RENTAL_FORM_CHECKOUT_BTN).click();
        cy.get(RENTAL_AGREEMENT_HEADER).contains('Rental Agreement');
        cy.get(RENTAL_AGREEMENT_TOOL_CODE).contains('JAKR');
        cy.get(RENTAL_AGREEMENT_TOOL_TYPE).contains('jackhammer');
        cy.get(RENTAL_AGREEMENT_TOOL_BRAND).contains('Ridgid');
        cy.get(RENTAL_AGREEMENT_DATE_CHECKOUT).contains('07/02/20');
        cy.get(RENTAL_AGREEMENT_DATE_RETURN).contains('07/06/20');
        cy.get(RENTAL_AGREEMENT_DAILY_CHARGE).contains('$2.99');
        cy.get(RENTAL_AGREEMENT_CHARGEABLE_DAYS).contains('1');
        cy.get(RENTAL_AGREEMENT_SUBTOTAL).contains('$2.99');
        cy.get(RENTAL_AGREEMENT_DISCOUNT_PERCENT).contains('50%');
        cy.get(RENTAL_AGREEMENT_DISCOUNT_AMOUNT).contains('$1.50');
        cy.get(RENTAL_AGREEMENT_TOTAL).contains('$1.49');
    });
});

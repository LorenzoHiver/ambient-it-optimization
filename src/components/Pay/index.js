import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Checkbox, Icon } from "antd";
import EmaBot from "../../images/ema_botblue.png";

import StripeCheckout from "react-stripe-checkout";
import { STRIPE_PUBLIC_KEY } from "../../utils/stripe";

const PRICING = 0.2;
class Pay extends Component {
  onToken = token => {
    console.log(JSON.stringify(token));
    fetch("/save-stripe-token", {
      method: "POST",
      body: JSON.stringify(token)
    }).then(response => {
      response.json().then(data => {
        alert(`We are in business, ${data.email}`);
      });
    });
  };

  onTouchTap = e => {
    console.log("ontouchtap", e);
  };

  render() {
    const { scheduled_sms, attendees, user, event } = this.props;
    let smsCount = 0;
    let contactCount = attendees.filter(attendee => attendee.profile.cell_phone)
      .length;

    for (let i = 0; i < scheduled_sms.length; i++) {
      const sms = scheduled_sms[i];
      smsCount += Math.ceil(sms.text.length / 160);
    }
    let totalSms = smsCount * contactCount;
    let pricing = totalSms * PRICING;
    let currency = event.currency === "EUR" ? "€" : "$";

    return (
      <div>
        <h1>
          <Icon
            type="dollar-circle"
            theme="filled"
            className="icon-section"
          />{" "}
          Verify and check out
        </h1>
        <p>
          You are scheduling <strong>{smsCount} text messages</strong> to{" "}
          <strong>{contactCount} of your contacts</strong>.<br />
          That’s <strong>{totalSms} text messages</strong> in total.
          <br />
          This will cost you{" "}
          <span className={"price"}> {currency + Math.ceil(pricing)} </span>.
        </p>
        {/* <p><Checkbox> Send email unstead to people who don't have a phone number</Checkbox></p> */}
        <br />
        <StripeCheckout
          name="Ema" // the pop-in header title
          description="Send SMS to your attendees" // the pop-in header subtitle
          image={EmaBot}
          // ComponentClass="div"
          panelLabel="Pay" // prepended to the amount in the bottom pay button
          amount={Math.ceil(pricing) * 100} // cents
          currency={event.currency === "EUR" ? "EUR" : "USD"}
          stripeKey={STRIPE_PUBLIC_KEY}
          locale="fr"
          email={user.email}
          // Note: Enabling either address option will give the user the ability to
          // fill out both. Addresses are sent as a second parameter in the token callback.
          shippingAddress={false}
          billingAddress={false}
          // Note: enabling both zipCode checks and billing or shipping address will
          // cause zipCheck to be pulled from billing address (set to shipping if none provided).
          zipCode={false}
          allowRememberMe // "Remember Me" option (default true)
          token={this.onToken} // submit callback
          // opened={this.onOpened} // called when the checkout popin is opened (no IE6/7)
          // closed={this.onClosed} // called when the checkout popin is closed (no IE6/7)

          // Note: `reconfigureOnUpdate` should be set to true IFF, for some reason
          // you are using multiple stripe keys
          reconfigureOnUpdate={false}
          // Note: you can change the event to `onTouchTap`, `onClick`, `onTouchStart`

          // triggerEvent="onTouchTap"
        >
          <Button id={"primary-button"} type={"primary"}>
            Pay now and schedule your messages
          </Button>
        </StripeCheckout>
        <p style={{ color: "lightgrey", marginTop: 10, marginBottom: 20 }}>
          Payment processed with Stripe.
        </p>
      </div>
    );
  }
}

const mapStateToProps = ({ schedule, attendees, user, event }) => ({
  scheduled_sms: schedule.scheduled_sms,
  attendees,
  user,
  event
});

// const mapDispatchToProps = dispatch => {
//   return {
//     editBox: (index, info) => dispatch(editBox(index, info))
//   };
// };

export default connect(
  mapStateToProps,
  null
)(Pay);

const Eb = {
  id: "tok_1EmbFPGbh27lzp9c5Th6kbI9",
  object: "token",
  card: {
    id: "card_1EmbFPGbh27lzp9ccbjSJJd3",
    object: "card",
    address_city: null,
    address_country: null,
    address_line1: null,
    address_line1_check: null,
    address_line2: null,
    address_state: null,
    address_zip: null,
    address_zip_check: null,
    brand: "Visa",
    country: "US",
    cvc_check: "pass",
    dynamic_last4: null,
    exp_month: 8,
    exp_year: 2042,
    funding: "credit",
    last4: "4242",
    metadata: {},
    name: "media@42entrepreneurs.fr",
    tokenization_method: null
  },
  client_ip: "193.252.106.172",
  created: 1560841011,
  email: "media@42entrepreneurs.fr",
  livemode: false,
  type: "card",
  used: false
};

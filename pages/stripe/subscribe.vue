<template>
  <div>
    <div class="flex justify-content-center">
      <div class="subscription-intro">
        <h1>Help the dev!</h1>
        <div class="flex flex-column align-items-start gap-3 mb-4">
          <p>
            There are currently no paid features, the subscription is
            <strong>just a donation</strong> for now. Your help is very much
            appreciated!
          </p>
          <p>What you get:</p>
          <ul>
            <li>Unconditional love & recognition from the dev.</li>
            <li>Street cred for helping out a fellow dev.</li>
            <li>Access to upcoming pro features.</li>
          </ul>
        </div>
      </div>
    </div>
    <StripeCheckout />
  </div>
</template>

<style scoped>
.subscription-intro {
  max-width: 888px;
  width: 100%;
}
</style>

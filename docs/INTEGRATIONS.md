# Integrations — @n-ramos/cookie-consent

Guide d'intégration officiel.

---

## Scripts différés

```html
<script type="text/plain" data-cookie-category="analytics" data-service="differed-script">
  console.log("Activated after consent");
</script>
```

---

## Google Analytics / GA4

```html
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted',
  });
</script>
```

---

## Google Tag Manager

```html
<script type="text/plain" data-cookie-category="analytics" data-service="analytics">
  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});
  var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
  j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
  f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-XXXX');
</script>
```

---

## Microsoft Clarity

```html
<script type="text/plain" data-cookie-category="analytics">
  (function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;
    t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];
    y.parentNode.insertBefore(t,y);
  })(window, document, "clarity", "script", "XXXX");
</script>
```

---

## WebComponent / CDN

```html
<script defer src="https://unpkg.com/@n-ramos/cookie-consent/dist-cdn/cookie-consent.js"></script>
<cookie-consent config='{"categories":[...]}'></cookie-consent>
```

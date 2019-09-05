<html>
<head>
    <title>SAML Logout Request</title>
</head>
<body>
<!-- action is already encoded -->
<form id="idp" method="post" action="${action}">
    <input type="hidden" name="SAMLRequest" value="${SAMLRequest?html}" />
    <input type="hidden" name="Signature" value="${Signature?html}"/>
    <input type="hidden" name="SigAlg" value="${SigAlg?html}"/>
    <input type="hidden" name="KeyInfo" value="${KeyInfo?html}"/>
</form>
<script type="text/javascript">//<![CDATA[
var form = document.getElementById("idp");
form.submit();
//]]</script>
</body>
</html>
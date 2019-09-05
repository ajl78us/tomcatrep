<html>
<head>
    <title>SAML Logout Request</title>
</head>
<body>
<!-- action is already encoded -->
<form id="idp" method="post" action="${action}">
    <input type="hidden" name="SAMLResponse" value="${SAMLResponse?html}" />
    <#if RelayState??>
        <input type="hidden" name="RelayState" value="${RelayState?html}" />
    </#if>
</form>
<script type="text/javascript">//<![CDATA[
var form = document.getElementById("idp");
form.submit();
//]]</script>
</body>
</html>
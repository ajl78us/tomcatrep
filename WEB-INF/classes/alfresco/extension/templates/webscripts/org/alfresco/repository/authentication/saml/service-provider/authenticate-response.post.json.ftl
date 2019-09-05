<#escape x as jsonUtils.encodeJSONString(x)>
<#if ticket??>
{
    "entry": {
        "id": "${ticket}",
        "userId": "${userId}"
    }
}
<#else>
{
    "entry": {
        "userId": "${userId}"
    }
}
</#if>
</#escape>

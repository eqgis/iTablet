
const contryCode = require('./countryCode.json')

const jsonData = {
  contryCode,
}

function getJson(): typeof jsonData {
  return jsonData
}

/********************** html资源 **********************/

// const LangchaoUserPrivacyPolicy_CN = require("./LangchaoUserPrivacyPolicy_CN.html")
// const LangchaoUserPrivacyPolicy_CN = require("./一键呼叫隐私政策.html")
const LangchaoUserPrivacyPolicy_EN = require("./LangchaoUserPrivacyPolicy_EN.html")


const LangchaoUserPrivacyPolicy_CN = `
<html>

<head>
<meta http-equiv=Content-Type content="text/html; charset=utf-8">
<meta name=Generator content="Microsoft Word 15 (filtered)">

<style id="dynCom" type="text/css"><!-- --></style>
<script language="JavaScript"><!--
function msoCommentShow(anchor_id, com_id)
{
	if(msoBrowserCheck()) 
		{
		c = document.all(com_id);
		a = document.all(anchor_id);
		if (null != c && null == c.length && null != a && null == a.length)
			{
			var cw = c.offsetWidth;
			var ch = c.offsetHeight;
			var aw = a.offsetWidth;
			var ah = a.offsetHeight;
			var x  = a.offsetLeft;
			var y  = a.offsetTop;
			var el = a;
			while (el.tagName != "BODY") 
				{
				el = el.offsetParent;
				x = x + el.offsetLeft;
				y = y + el.offsetTop;
				}
			var bw = document.body.clientWidth;
			var bh = document.body.clientHeight;
			var bsl = document.body.scrollLeft;
			var bst = document.body.scrollTop;
			if (x + cw + ah / 2 > bw + bsl && x + aw - ah / 2 - cw >= bsl ) 
				{ c.style.left = x + aw - ah / 2 - cw; }
			else 
				{ c.style.left = x + ah / 2; }
			if (y + ch + ah / 2 > bh + bst && y + ah / 2 - ch >= bst ) 
				{ c.style.top = y + ah / 2 - ch; }
			else 
				{ c.style.top = y + ah / 2; }
			c.style.visibility = "visible";
}	}	}
function msoCommentHide(com_id) 
{
	if(msoBrowserCheck())
		{
		c = document.all(com_id);
		if (null != c && null == c.length)
		{
		c.style.visibility = "hidden";
		c.style.left = -1000;
		c.style.top = -1000;
		} } 
}
function msoBrowserCheck()
{
	ms = navigator.appVersion.indexOf("MSIE");
	vers = navigator.appVersion.substring(ms + 5, ms + 6);
	ie4 = (ms > 0) && (parseInt(vers) >= 4);
	return ie4;
}
if (msoBrowserCheck())
{
	document.styleSheets.dynCom.addRule(".msocomanchor","background: infobackground");
	document.styleSheets.dynCom.addRule(".msocomoff","display: none");
	document.styleSheets.dynCom.addRule(".msocomtxt","visibility: hidden");
	document.styleSheets.dynCom.addRule(".msocomtxt","position: absolute");
	document.styleSheets.dynCom.addRule(".msocomtxt","top: -1000");
	document.styleSheets.dynCom.addRule(".msocomtxt","left: -1000");
	document.styleSheets.dynCom.addRule(".msocomtxt","width: 33%");
	document.styleSheets.dynCom.addRule(".msocomtxt","background: infobackground");
	document.styleSheets.dynCom.addRule(".msocomtxt","color: infotext");
	document.styleSheets.dynCom.addRule(".msocomtxt","border-top: 1pt solid threedlightshadow");
	document.styleSheets.dynCom.addRule(".msocomtxt","border-right: 2pt solid threedshadow");
	document.styleSheets.dynCom.addRule(".msocomtxt","border-bottom: 2pt solid threedshadow");
	document.styleSheets.dynCom.addRule(".msocomtxt","border-left: 1pt solid threedlightshadow");
	document.styleSheets.dynCom.addRule(".msocomtxt","padding: 3pt 3pt 3pt 3pt");
	document.styleSheets.dynCom.addRule(".msocomtxt","z-index: 100");
}
// --></script>
<style>
<!--
 /* Font Definitions */
 @font-face
	{font-family:"PingFang SC, Microsoft YaHe";
	panose-1:2 1 6 0 3 1 1 1 1 1;}
@font-face
	{font-family:"PingFang SC, Microsoft YaHe";
	panose-1:2 4 5 3 5 4 6 3 2 4;}
@font-face
	{font-family:"PingFang SC, Microsoft YaHe";
	panose-1:2 15 5 2 2 2 4 3 2 4;}
@font-face
	{font-family:"PingFang SC, Microsoft YaHe";
	panose-1:2 11 5 3 2 2 4 2 2 4;}
@font-face
	{font-family:"\@PingFang SC, Microsoft YaHe";}
@font-face
	{font-family:"\@PingFang SC, Microsoft YaHe";
	panose-1:2 1 6 0 3 1 1 1 1 1;}
 /* Style Definitions */
 p.MsoNormal, li.MsoNormal, div.MsoNormal
	{margin:0in;
	text-align:justify;
	text-justify:inter-ideograph;
	font-size:14px;
	font-family:"PingFang SC, Microsoft YaHe";}
p.MsoCommentText, li.MsoCommentText, div.MsoCommentText
	{mso-style-link:"Comment Text Char";
	margin:0in;
	text-align:left;
	font-size:14px;
	font-family:"PingFang SC, Microsoft YaHe";}
p
	{margin:0in;
	text-align:justify;
	text-justify:inter-ideograph;
	font-size:14px;
	font-family:"Calibri";}
span.CommentTextChar
	{mso-style-name:"Comment Text Char";
	mso-style-link:"Comment Text";
	font-family:"PingFang SC, Microsoft YaHe";}
span.fontstyle01
	{mso-style-name:fontstyle01;
	color:#494949;
	font-weight:normal;
	font-style:normal;}
span.msoIns
	{mso-style-name:"";
	text-decoration:underline;
	color:teal;}
span.msoDel
	{mso-style-name:"";
	text-decoration:line-through;
	color:red;}
span{
		line-height: 24px;
	}
.gnd{
	 	margin:  30px 0 !important;
		font-weight: 400 !important;
    }
.ged{
	 	margin:  30px 0 !important;
		font-weight: 400 !important;
    }
.ZCX{
		margin:  30px 0 !important;
}
@page WordSection1
	{size:8.5in 11.0in;
	margin:1.0in 1.25in 1.0in 1.25in;
	layout-grid:15.6pt;}
div.WordSection1
	{page:WordSection1;padding:50px;}
 /* List Definitions */
 ol
	{margin-bottom:0in;}
ul
	{margin-bottom:0in;}
-->
</style>

</head>

<body lang=EN-US style='word-wrap:break-word;text-justify-trim:punctuation'>

<div class=WordSection1 style='layout-grid:15.6pt'>

<p class=MsoNormal align=left style='text-align:left;text-indent:21.0pt'><b><span
lang=ZH-CN style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>《一键呼叫隐私政策 V1.0》</span></b></p>

<p class=MsoNormal align=left style='text-align:left;text-indent:21.0pt;font-family:"PingFang SC, Microsoft YaHe"'><span
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'><br>
      <span lang=ZH-CN>发布时间</span><b>:2023</b><span lang=ZH-CN>年</span><b> 02 </b><span
lang=ZH-CN>月</span><b> 07 </b><span lang=ZH-CN>日</span><br>
      <span lang=ZH-CN>更新</span>/<span lang=ZH-CN>生效时间</span><b>:2023</b><span
lang=ZH-CN>年</span><b> 02 </b><span lang=ZH-CN>月</span><b> 07 </b><span lang=ZH-CN>日</span></span></p>

<p class=MsoNormal align=left style='text-align:left'><span style='font-size:
14px;font-family:"PingFang SC, Microsoft YaHe"'><br>
      <b><span lang=ZH-CN>浪潮数字企业技术有限公司（以下称为“我们”）非常重视您的个人信息安全保护，我们将按照法律法规要求，采取相应安全保护措施，尽力保护您的个人信息安全可控。</span></b><br>
<br>
      <span lang=ZH-CN>我们希望通过《一键呼叫隐私政策》（以下简称“本政策”）向您说明浪潮数字企业技术有限公司“一键呼叫</span><b>APP</b><span
lang=ZH-CN>平台”业务（以下简称“一键呼叫</span><b>APP</b><span lang=ZH-CN>”）如何收集、使用、存储和共享您的个人信息，以及您可以如何行使您的隐私权利。</span><br>
<br>
      <span lang=ZH-CN>请您在使用“一键呼叫</span><b>APP</b><span lang=ZH-CN>”前，认真阅读并充分理解《一键呼叫隐私政策》的全部内容。在阅读过程中，如您对本政策内容有任何疑问、意见或建议，请联系我们。您使用或在我们更新本政策后继续使用我们的产品或服务，即表示您同意本政策（含更新版本）内容，并且同意我们按照本政策收集、存储、使用和共享您的相关信息。</span><br>
<br>
      <b><span lang=ZH-CN>概要</span></b><br>
<br>
      <span lang=ZH-CN>我们将通过本隐私政策向您介绍不同场景下我们如何处理个人信息。当您开启或使用一键呼叫<b><span lang=ZH-CN>APP</span></b>时，为实现您选择使用的功能、服务，或为遵守法律法规的要求，我们会处理相关信息。除实现一键呼叫<b><span lang=ZH-CN>APP</span></b>基本功能、服务所需的信息，和根据法律法规要求所必需的信息之外，您可以拒绝我们处理其他信息，但这可能导致我们无法提供对应功能、服务。我们将在隐私政策中逐项说明相关情况，有关您个人信息权益的重要条款已用加粗形式提示，请特别关注。</span><br>
<br>
      <span lang=ZH-CN>除本隐私政策外，在特定场景下，我们还会通过即时告知(含弹窗、页面提示等)、功能更新说明等方式，向您说明对应的信息收集目的、范围及使用方式，这些即时告知及功能更新说明等构成本隐私政策的一部分，并与本隐私政策具有同等效力。</span><br>
<br>
      <span lang=ZH-CN>下文将帮您详细了解我们如何收集、使用、存储、传输、公开与保护个人信息；帮您了解查询、更正、补充、删除、复制、转移个人信息的方式。</span><br>
<br>
</p>

<p class=MsoNormal align=left style='text-align:left;text-indent:21.0pt'>    <span lang=ZH-CN>本政策包含以下内容：</span></p>
<p class="MsoNormal ZCX" align=left style='text-align:left;text-indent:21.0pt'>    <span lang=ZH-CN>一、我们如何收集和使用您的个人信息</span></p>
<p class="MsoNormal ZCX" align=left style='text-align:left;text-indent:21.0pt'>    <span
lang=ZH-CN style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>二、我们如何使用</span><span
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>Cookie<span
lang=ZH-CN>和同类技术</span></span></p>

<p class="MsoNormal ZCX" align=left style='text-align:left;text-indent:21.0pt'>    <span
lang=ZH-CN style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>三、我们如何共享、转让、公开披露您的个人信息</span></p>

<p class="MsoNormal ZCX" align=left style='text-align:left;text-indent:21.0pt'>    <span
lang=ZH-CN style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>四、我们如何存储及保护您的个人信息</span></p>

<p class="MsoNormal ZCX" align=left style='text-align:left;text-indent:21.0pt'>    <span
lang=ZH-CN style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>五、例外情况</span></p>

<p class="MsoNormal ZCX" align=left style='text-align:left;text-indent:21.0pt'>    <span
lang=ZH-CN style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>六、使用规则</span></p>

<p class="MsoNormal ZCX" align=left style='text-align:left;text-indent:21.0pt'>    <span
lang=ZH-CN style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>七、未成年人隐私权保护特别约定</span></p>

<p class="MsoNormal ZCX" align=left style='text-align:left;text-indent:21.0pt'>    <span
lang=ZH-CN style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>八、本政策如何更新</span></p>

<p class="MsoNormal ZCX" align=left style='text-align:left;text-indent:21.0pt'>    <span
lang=ZH-CN style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>九、如何联系我们</span></p>

<p class=MsoNormal align=center style='text-align:center'><span
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>&nbsp;</span></p>

<p class=MsoNormal align=center style='text-align:center'><span
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'><br>
</span><b><span lang=ZH-CN style='font-size:15.0pt;font-family:"PingFang SC, Microsoft YaHe"'>一、我们如何收集和使用您的个人信息</span></b><span
style='font-size:15.0pt;font-family:"PingFang SC, Microsoft YaHe"'><br>
<br>
</span></p>

<p class=MsoNormal align=left style='text-align:left'><span style='font-size:
14px;font-family:"PingFang SC, Microsoft YaHe"'><br>
    <b><span lang=ZH-CN>“个人信息”</span></b><span lang=ZH-CN style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>是指以电子或者其他方式记录的能够单独或者与其他信息结合识别特定自然人身份或者反映特定自然人活动情况的各种信息。</span></span></p>

<p class=MsoNormal align=left style='text-align:left'><span style='font-size:
14px;font-family:"PingFang SC, Microsoft YaHe"'>&nbsp;</span></p>

<p class=MsoNormal align=left style='text-align:left;text-indent:21.0pt'><b><span
lang=ZH-CN style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>特别注意：</span>
<br>
</br>    <span
lang=ZH-CN style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'><b>“一键呼叫</b></span><b><span
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>APP<span
lang=ZH-CN>”是作为贵公司“应急指挥系统”的增值产品，所有的数据都是存储在贵公司的服务器及您个人手机上，浪潮数字企业技术有限公司不会收集您的任何信息。</span></span></b></p>

<p class=MsoNormal align=left style='text-align:left'><span style='font-size:
14px;font-family:"PingFang SC, Microsoft YaHe"'>&nbsp;</span></p>

<p class=MsoNormal align=left style='text-align:left;text-indent:21.0pt'><b><span
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>1.<span
lang=ZH-CN>我们如何收集您的信息</span></span></b></p>

<p class=MsoNormal align=left style='text-align:left'><span style='font-size:
14px;font-family:"PingFang SC, Microsoft YaHe"'><br>
      <a><b>1.1<span lang=ZH-CN>、登陆</span>/<span lang=ZH-CN>修改密码</span></b></a></span><span
class=MsoCommentReference><span style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'><a
class=msocomanchor id="_anchor_1"
onmouseover="msoCommentShow('_anchor_1','_com_1')"
onmouseout="msoCommentHide('_com_1')" href="#_msocom_1" language=JavaScript
name="_msoanchor_1"></a>&nbsp;</span></span></p>

<p class=MsoNormal align=left style='text-align:left'><b><span
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>&nbsp;</span></b></p>

<p class=MsoNormal align=left style='text-align:left;text-indent:21.0pt;font-weight: 400 !important;'>    <span
lang=ZH-CN style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>一键呼叫</span><span
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>APP<span
lang=ZH-CN>的账号是由贵公司统一分配，无需注册。</span></span></p>
<br>
<p class=MsoNormal align=left style='text-align:left'><span style='font-size:
14px;font-family:"PingFang SC, Microsoft YaHe"'></p>

<p class=MsoNormal align=left style='text-align:left;text-indent:21.0pt'>    <span
lang=ZH-CN style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe";font-weight: 400 !important;'>当您使用“一键呼叫</span><span
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>APP<span
lang=ZH-CN style="font-weight: 400 !important;">”的账号密码登录功能时，我们会使用您的 <b>账号、密码、</b></span><b>IP<span lang=ZH-CN>地址</span></b><span
lang=ZH-CN style="font-weight: 400 !important;"> 用于身份验证，您的 <b>移动网络或</b></span><b>Wlan<span lang=ZH-CN>网络 用于网络通讯</span></b><span
lang=ZH-CN style="font-weight: 400 !important;">，这类信息是为提供服务必须收集的必要信息，若您不提供，您将无法正常登录。</span></span></p>

<p class=MsoNormal align=left style='text-align:left'><span style='font-size:
14px;font-family:"PingFang SC, Microsoft YaHe"'>&nbsp;</span></p>

<p class=MsoNormal align=left style='text-align:left;text-indent:21.0pt'>    <span
lang=ZH-CN style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe";font-weight: 400 !important;'>您使用“一键呼叫</span><span
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>APP<span
lang=ZH-CN style="font-weight: 400 !important;">”的修改密码功能时，我们会使用您的<b>账号、原始密码、</b></span><a><b>IP<span lang=ZH-CN >地址</span></b><span
lang=ZH-CN>、</span></a></span><span class=MsoCommentReference><span
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'><a
class=msocomanchor id="_anchor_2"
onmouseover="msoCommentShow('_anchor_2','_com_2')"
onmouseout="msoCommentHide('_com_2')" href="#_msocom_2" language=JavaScript
name="_msoanchor_2"></a>&nbsp;</span></span><span lang=ZH-CN
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe";font-weight: 400 !important;'>用于身份验证，您的 <b>移动网络或</b></span><b><span
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>Wlan<span
lang=ZH-CN>网络 </span></span></b><span lang=ZH-CN style='font-size:14px;
font-family:"PingFang SC, Microsoft YaHe";font-weight: 400 !important;'>用于网路通讯，您的<b>新密码</b>用于修改密码，这类信息是为提供服务必须收集的必要信息，若您不提供，您将无法修改密码。</span></p>

<p class=MsoNormal align=left style='text-align:left'><span
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe";color:#E7E6E6'>&nbsp;</span></p>

<p class=MsoNormal align=left style='text-align:left;
text-indent:20.9pt'><b><span style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>    1.2、<span
lang=ZH-CN>维护个人信息</span></span></b></p>
<br>
<p class=MsoNormal align=left style='text-align:left;text-indent:21.0pt'>    <span
lang=ZH-CN style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe";font-weight: 400 !important;'>您登陆“一键呼叫</span><span
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>APP<span
lang=ZH-CN style="font-weight: 400 !important;">”后，可以继续维护个人信息，为提供您在一键呼叫</span>APP<span lang=ZH-CN style="font-weight: 400 !important;">上查看您去往国家城市更精准的地图服务我们需要以下信息：<b>去往国家、去往城市</b>，如果您拒绝设置，您将不能获取详尽的地图服务。</span></span></p>

<p class=MsoNormal align=left style='text-align:left'><span
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>&nbsp;</span></p>

<p class=MsoNormal align=left style='text-align:left;
text-indent:20.9pt'><b><span style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>    1.3、<span
lang=ZH-CN>呼叫服务</span></span></b></p>
<br>
<p class=MsoNormal align=left style='text-align:left;text-indent:21.0pt'>    <span
lang=ZH-CN style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe";font-weight: 400 !important;'>在您使用“一键呼叫</span><span
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>APP<span
lang=ZH-CN style="font-weight: 400 !important;">”的呼叫服务时，我们会使用您的 <b>移动网络、手机号码、手机设备识别码</b> 用于电话呼叫，这类信息是为提供服务必须收集的必要信息，若您不提供，您将无法进行呼叫服务。同时</span></span><span
class=fontstyle01><span lang=ZH-CN style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe";
color:windowtext;font-weight: 400 !important;'>我们需要调⽤您的</span></span><span class=fontstyle01><b><span
lang=ZH-CN style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe";
color:windowtext'>位置权限</span></b></span><span class=fontstyle01><span
lang=ZH-CN style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe";
color:windowtext;font-weight: 400 !important;'>⽤于获取您的位置信息</span></span><span lang=ZH-CN style='font-size:
14px;font-family:"PingFang SC, Microsoft YaHe";font-weight: 400 !important;'>，此为非必要信息，若您不提供，贵公司将不能确定您呼叫的位置；</span><span
class=fontstyle01><span lang=ZH-CN style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe";
color:windowtext;font-weight: 400 !important;'>我们还需要记录您的</span></span><span class=fontstyle01><b><span
lang=ZH-CN style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe";
color:windowtext'>呼叫人电话、呼叫时长</span></b></span><span class=fontstyle01><span
lang=ZH-CN style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe";
color:windowtext;font-weight: 400 !important;'>⽤于历史记录的记录与展示。</span></span></p>

<p class=MsoNormal align=left style='text-align:left'><span class=fontstyle01><span
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>&nbsp;</span></span></p>

<p class=MsoNormal align=left style='text-align:left;text-indent:21.0pt'>    <span
class=fontstyle01><span lang=ZH-CN style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe";font-weight: 400 !important;'>为方便您对每次呼叫内容做补充说明，我们需要调用您的</span></span><span
class=fontstyle01><b><span lang=ZH-CN style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>相机权限</span></b></span><span
class=fontstyle01><span lang=ZH-CN style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>用于拍照，调用您的</span></span><span
class=fontstyle01><b><span lang=ZH-CN style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>访问相册权限</span></b></span><span
class=fontstyle01><span lang=ZH-CN style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>用于选择图片。</span></span></p>

<p class=MsoNormal align=left style='text-align:left'><span style='font-size:
14px;font-family:"PingFang SC, Microsoft YaHe"'>&nbsp;</span></p>

<p class=MsoNormal align=left style='text-align:left;
text-indent:20.9pt'><b><span style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>    1.4、
<span lang=ZH-CN>轨迹服务</span></span></b></p>
<br>
<p class=MsoNormal align=left style='text-align:left;
text-indent:20.9pt'>    <span lang=ZH-CN style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe";font-weight: 400 !important;'>在您使用“一键呼叫</span><span
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>APP<span
lang=ZH-CN style="font-weight: 400 !important;">”的轨迹记录服务时，我们会通过</span>IP<span lang=ZH-CN>地址、</span>GPS<span
lang=ZH-CN style="font-weight: 400 !important;">以及能够提供相关信息的其他传感器（包括附近设置、</span>Wi-Fi<span lang=ZH-CN style="font-weight: 400 !important;">接入点和基站信息）来校准您的<b>位置信息</b>。</span></span></p>

<p class=MsoNormal align=left style='text-align:left'><span
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>&nbsp;</span></p>

<p class=MsoNormal align=left style='text-align:left;
text-indent:20.9pt'><b><span style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>    1.5、<span
lang=ZH-CN>通讯录服务</span></span></b></p>
<br>
<p class=MsoNormal align=left style='text-align:left;text-indent:21.0pt'>    <span
lang=ZH-CN style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe";font-weight: 400 !important;'>在您使用“一键呼叫</span><span
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>APP<span
lang=ZH-CN style="font-weight: 400 !important;">”的通讯录服务时，我们会使用您的 <b>移动网络</b></span><b>/Wlan<span lang=ZH-CN>网络、</span>IP<span
lang=ZH-CN>地址、账号编号</span></b><span lang=ZH-CN style="font-weight: 400 !important;">、用于<b>读取联系人信息</b>，这类信息是为提供服务必须收集的必要信息。</span></span></p>

<p class=MsoNormal align=left style='text-align:left'><span
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>&nbsp;</span></p>

<p class=MsoNormal align=left style='text-align:left;
text-indent:20.9pt'><b><span style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>    1.6、<span
lang=ZH-CN>其他服务</span></span></b></p>
<br>
<p class=MsoNormal align=left style='text-align:left;
text-indent:20.9pt'>   <span lang=ZH-CN style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe";font-weight: 400 !important;'>“一键呼叫</span><span
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>APP<span
lang=ZH-CN>”</span></span><span lang=ZH-CN style='font-size:14px;font-family:
"PingFang SC, Microsoft YaHe";color:black;font-weight: 400 !important;'>是基于</span><span style='font-size:
14px;font-family:"PingFang SC, Microsoft YaHe";color:black'> SuperMap iTablet<span
lang=ZH-CN style="font-weight: 400 !important;">定制开发</span></span><span lang=ZH-CN style='font-size:14px;
font-family:"PingFang SC, Microsoft YaHe";font-weight: 400 !important;'>，您的个人信息的收集和使用<a><b>遵循<span
style='color:#00B0F0'>超图软件的隐私政策</span></b>。<br></a></span><span
class=MsoCommentReference><span style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'><a
class=msocomanchor id="_anchor_3"
onmouseover="msoCommentShow('_anchor_3','_com_3')"
onmouseout="msoCommentHide('_com_3')" href="#_msocom_3" language=JavaScript
name="_msoanchor_3"></a>&nbsp;</span></span></p>

<p class=MsoNormal align=left style='text-align:left;
text-indent:20.9pt'>    <span lang=ZH-CN style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe";font-weight: 400 !important;'>为了确保服务安全，帮助我们更好地收集“一键呼叫</span><span
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>APP<span
lang=ZH-CN style="font-weight: 400 !important;">”的运行情况，我们可能记录相关信息，包括使用<b>“一键呼叫</b></span><b>APP<span lang=ZH-CN>”的频率、崩溃数据、总体使用情况、性能数据以及应用程序的来源。</span></b></span></p>

<p class=MsoNormal align=left style='text-align:left'><b><span
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>&nbsp;</span></b></p>

<p class=MsoNormal align=left style='text-align:left;text-indent:21.0pt;font-weight: 400 !important;'>    <span
lang=ZH-CN style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>为更好地为您提供服务，我们可能会接收关联公司、业务合作伙伴等第三方提供的您的相关信息。</span></p>

<p class=MsoNormal align=left style='text-align:left'><span style='font-size:
14px;font-family:"PingFang SC, Microsoft YaHe"'>&nbsp;</span></p>

<p class=MsoNormal align=left style='text-align:left;text-indent:21.0pt'><b><span
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>    1.7、APP<span
lang=ZH-CN>适配及安全性</span></span></b></p>

<p class=MsoNormal align=left style='text-align:left'><span style='font-size:
14px;font-family:"PingFang SC, Microsoft YaHe"'>&nbsp;</span></p>

<p class=MsoNormal align=left style='text-align:left;text-indent:21.0pt;font-weight: 400 !important;'>    <span
lang=ZH-CN style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>为了保证不同设备用户的使用体验及</span><span
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>APP<span
lang=ZH-CN>兼容性，我们会收集您的设备信息 设备型号、操作系统版本、其他设备信息（屏幕分辨率、屏幕尺寸、</span>CPU<span
lang=ZH-CN>架构、内存容量、磁盘容量）、浏览器类型。上述信息为</span>APP<span lang=ZH-CN>适配所需的必要信息，若您不提供这类信息，将可能导致</span>APP
<span lang=ZH-CN>无法正常运行。</span><br>
<br>
<br>
      <b>2.<span lang=ZH-CN>使用说明</span></b></span></p>
<br>
<p class=MsoNormal align=left style='text-align:left;text-indent:21.0pt;font-weight: 400 !important;'>   <span
lang=ZH-CN style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>在遵守国家相关法律法规的前提下，我们可能在提供以下服务时使用接收到的信息用于以下服务：</span><span
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'><br>
<br>
       <span lang=ZH-CN></span></span><span lang=ZH-CN style='font-size:
14px;font-family:"PingFang SC, Microsoft YaHe";color:#404040'>2.1、我们将按照前述声明在服务中使用您的个人信息，如我们需要基于本政策未载明的其他用途或非特定目的收集或使用您的个人信息，我们会事先征求您的同意。</span></p>

<p class=MsoNormal align=left style='text-align:left'><b><span
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>&nbsp;</span></b></p>

<p class=MsoNormal align=left style='text-align:left;
text-indent:20.9pt;font-weight: 400 !important;'>   <span style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>2.2、<b><span
lang=ZH-CN></span></b><span lang=ZH-CN>在收集您的个人信息后，我们将在符合相关法律法规的前提下，基于整体分析和使用的目的，通过技术手段对个人信息进行去标识化处理。去标识化处理后的信息将无法识别主体。</span></span></p>

<p class=MsoNormal align=left style='text-align:left'><b><span
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>&nbsp;</span></b></p>

<p class=MsoNormal align=left style='text-align:left;text-indent:21.0pt'>   <b><span
lang=ZH-CN style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>请您注意，您同意我们使用以上信息及权限，即代表您授权我们可以收集和使用这些个人信息，您关闭权限即代表您取消了这些授权，则我们将不再继续收集和使用您的个人信息，也无法为您提供与这些授权所对应的相关功能。您关闭授权的决定不会影响此前基于您的授权所进行的个人信息的处理。</span></b><span
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'><br>
<br>
      <b><span lang=ZH-CN>请您放心，我们收集和使用的个人信息均是在经过您的授权后通过合法渠道获得，不会从任何非法渠道间接获取您的个人信息。</span></b><br>
<br>
</span></p>

<p class=MsoNormal align=center style='text-align:center;text-indent:21.0pt'><span
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'><br>
      </span><b><span lang=ZH-CN style='font-size:15.0pt;font-family:"PingFang SC, Microsoft YaHe"'>二、我们如何使用</span></b><b><span
style='font-size:15.0pt;font-family:"PingFang SC, Microsoft YaHe"'>Cookie<span
lang=ZH-CN>和同类技术</span></span></b></p>

<p class=MsoNormal align=center style='text-align:center;text-indent:21.0pt'><b><span
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>&nbsp;</span></b></p>

<p class=MsoNormal align=left style='text-align:left;
text-indent:21pt'>   <span class=fontstyle01><span style='font-size:14px;
font-family:"PingFang SC, Microsoft YaHe"'>Cookie<span lang=ZH-CN>是⽀持服务器端（或者脚本）在客户端上存储和检索信息的⼀种机制。</span></span></span></p>

<p class=MsoNormal align=left style='text-align:left'><span
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>&nbsp;</span></p>

<p class=MsoNormal align=left style='text-align:left;text-indent:21.0pt;font-weight: 400 !important;'>   <span
lang=ZH-CN style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>为确保“一键呼叫</span><span
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>APP<span
lang=ZH-CN>”正常运转，我们会在您的计算机或移动设备上存储名为</span>Cookie<span lang=ZH-CN>的小数据文件。</span>Cookie<span
lang=ZH-CN>通常包含标识符、站点名称以及一些号码和字符。</span></span></p>

<p class=MsoNormal align=left style='text-align:left'><span style='font-size:
14px;font-family:"PingFang SC, Microsoft YaHe"'>&nbsp;</span></p>

<p class=MsoNormal align=left style='text-align:left;text-indent:21.0pt;font-weight: 400 !important;'>   <span
lang=ZH-CN style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>我们不会将</span><span
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>Cookie<span
lang=ZH-CN>用于本政策所述目的之外的任何用途。您可根据自己的偏好管理或删除</span>Cookie<span lang=ZH-CN>。您可以清除“一键呼叫</span>APP<span
lang=ZH-CN>”上保存的所有</span>Cookie<span lang=ZH-CN >，大部分网络浏览器都设有阻止</span>Cookie<span
lang=ZH-CN>的功能。但如果您这么做，则需要在每一次访问我们的客户端时更改用户设置。</span></span></p>

<p class=MsoNormal align=center style='text-align:center;text-indent:21.0pt'><span
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'><br>
<br>
      </span><b><span lang=ZH-CN style='font-size:15.0pt;font-family:"PingFang SC, Microsoft YaHe"'>三、我们如何共享、转让、公开披露您的个人信息</span></b></p>

<p class=MsoNormal align=left style='text-align:left;text-indent:21.0pt'><span
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'><br>
   <b>1.<span lang=ZH-CN>共享</span><br>
</b><br>
      <span lang=ZH-CN style="font-weight: 400 !important;">我们不会与浪潮数字企业技术有限公司以外的任何公司、组织和个人共享您的个人信息，但以下情况除外：</span><br>
<br>
      <span lang=ZH-CN style="font-weight: 400 !important;">1.1、我们可能会根据法律法规规定，或按政府主管部门的强制性要求，对外共享您的个人信息。</span></span></p>

<p class=MsoNormal align=left style='text-align:left'><span
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>&nbsp;</span></p>

<p class=MsoNormal align=left style='text-align:left;text-indent:21.0pt'>  <span
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe";font-weight: 400 !important;'>1.2、<span
lang=ZH-CN>关联公司共享：获得您的明确同意后，我们可能会与我们的关联公司共享您的个人信息：我们只会共享必要的个人信息，且受隐私政策中所声明目的的约束。关联公司如要改变个人信息的处理目的，将再次征求您的授权同意。</span></span></p>

<p class=MsoNormal align=left style='text-align:left'><span
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>&nbsp;</span></p>

<p class=MsoNormal align=left style='text-align:left;text-indent:21.0pt'>  <span
lang=ZH-CN style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe";font-weight: 400 !important;'>我们的关联公司包括浪潮数字企业技术有限公司现在或将来控制、受控制或与其处于共同控制下的任何公司、机构以及上述公司或机构的合法继承人。其中“控制”是指直接或间接地拥有影响所提及公司管理的能力，无论是通过所有权、有投票权的股份、合同或其他被人民法院认定的方式。</span></p>

<p class=MsoNormal align=left style='text-align:left'><span
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>&nbsp;</span></p>

<p class=MsoNormal align=left style='text-align:left;text-indent:21.0pt'>  <span
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe";font-weight: 400 !important;'>1.3、<span
lang=ZH-CN>授权合作伙伴共享：仅为实现本政策中声明的目的，我们的某些服务将由授权合作伙伴提供。我们可能会与合作伙伴共享您的某些个人信息，以提供更好的客户服务和用户体验。例如，在您通过我们的客户端购买商品或订购业务时，我们必须与物流服务提供商共享您的个人信息才能安排送货，或者安排合作伙伴提供服务。我们仅会出于合法、正当、必要、特定、明确的目的共享您的个人信息，并且只会共享提供服务所必要的个人信息。我们的合作伙伴无权将共享的个人信息用于任何其他用途。对我们与之共享个人信息的公司、组织和个人，我们会与其签署相应的保密协定，要求他们按照我们的说明、本隐私政策以及其他任何相关的保密和安全措施来处理个人信息。</span></span></p>

<p class=MsoNormal align=left style='text-align:left'><span
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>&nbsp;</span></p>

<p class=MsoNormal align=left style='text-align:left;text-indent:21.0pt'>  <span
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe";font-weight: 400 !important;'>1.4、<span
lang=ZH-CN>在获取您的明确同意后，我们可能会与关联公司、授权合作伙伴之外的其他方共享您的个人信息。</span></span></p>

<p class=MsoNormal align=left style='text-align:left'><b><span
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>&nbsp;</span></b></p>

<p class=MsoNormal align=left style='text-align:left;text-indent:21.0pt'><b><span
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>2.<span
lang=ZH-CN>转让</span></span></b></p>

<p class=MsoNormal align=left style='text-align:left'><span
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>&nbsp;</span></p>

<p class=MsoNormal align=left style='text-align:left;text-indent:21.0pt'>  <span
lang=ZH-CN style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe";font-weight: 400 !important;'>除以下情况外，我们不会将您的个人信息转让给任何公司、组织和个人。</span></p>

<p class=MsoNormal align=left style='text-align:left'><span
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>&nbsp;</span></p>

<p class=MsoNormal align=left style='text-align:left;text-indent:21.0pt'>  <span
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe";font-weight: 400 !important;'>2.1、<span
lang=ZH-CN>获得您的明确授权后，我们会向您授权的第三方转让您的个人信息。</span></span></p>

<p class=MsoNormal align=left style='text-align:left'><span
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>&nbsp;</span></p>

<p class=MsoNormal align=left style='text-align:left;text-indent:21.0pt'>  <span
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe";font-weight: 400 !important;'>2.2、<span
lang=ZH-CN>在“一键呼叫</span>APP<span lang=ZH-CN>”合并、收购或破产清算时，如涉及到个人信息转让时，我们会要求新的公司继续按本隐私政策接收、管理、使用和转让您的信息。若无法达成共识，我们会要求新的公司重新向您征求授权。</span></span></p>

<p class=MsoNormal align=left style='text-align:left'><b><span
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>&nbsp;</span></b></p>

<p class=MsoNormal align=left style='text-align:left;text-indent:21.0pt'><b><span
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>3.<span
lang=ZH-CN>公开披露</span></span></b></p>

<p class=MsoNormal align=left style='text-align:left'><span
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>&nbsp;</span></p>

<p class=MsoNormal align=left style='text-align:left;text-indent:21.0pt'>  <span
lang=ZH-CN style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe";font-weight: 400 !important;'>我们仅会在以下情况下，公开披露您的个人信息：</span></p>

<p class=MsoNormal align=left style='text-align:left'><span
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>&nbsp;</span></p>

<p class=MsoNormal align=left style='text-align:left;text-indent:21.0pt'>  <span
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe";font-weight: 400 !important;'>3.1、<span
lang=ZH-CN>获得您明确同意后，按您授权情况披露您的个人信息。</span></span></p>

<p class=MsoNormal align=left style='text-align:left'><span
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>&nbsp;</span></p>

<p class=MsoNormal align=left style='text-align:left;text-indent:21.0pt'>  <span
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe" ;font-weight: 400 !important;'>3.2、基于法律的披露：我们可能会在法律、法规程序、诉讼或政府主管部门强制性要求的情况下、向持有强制性文件的主体公开披露您的个人信息。</span></p>

<p class=MsoNormal align=left style='text-align:left'><b><span
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>&nbsp;</span></b></p>

<p class=MsoNormal align=left style='text-align:left'><b><span
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>&nbsp;</span></b></p>

<p class=MsoNormal align=center style='text-align:center'><b><span lang=ZH-CN
style='font-size:15.0pt;font-family:"PingFang SC, Microsoft YaHe"'>四、我们如何存储及保护您的个人信息</span></b></p>

<p class=MsoNormal align=left style='text-align:left'><b><span
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>&nbsp;</span></b></p>

<p class=MsoNormal align=left style='margin-left:0in;text-align:left;
text-indent:21.0pt'><span style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>1.<span
style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;</span></span><b><span
lang=ZH-CN style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>个人信息存储</span></b><span
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'><br>
<br>
      <span lang=ZH-CN style="font-weight: 400 !important;">1.1、信息存储的地点</span><br>
<br>
      <span lang=ZH-CN style="font-weight: 400 !important;">我们会按照法律法规规定，将境内收集的用户个人信息存储于中国境内，不存在境外收集用户信息情况。</span><br>
<br>
      <span lang=ZH-CN style="font-weight: 400 !important;">1.2、信息存储的期限</span><br>
<br>
      <span lang=ZH-CN style="font-weight: 400 !important;">我们承诺您的个人信息的存储时间始终处于合理必要期限内，我们根据业务需要时长及国家相关法律法规规定去存储用户信息，在您注销账号后，浪潮数字企业技术有限公司会根据使用的国家相关法律法规的要求</span style="font-weight: 400 !important;">15<span
lang=ZH-CN style="font-weight: 400 !important;">个工作日内对您的个人信息做删除或者匿名化处理。当我们的产品或服务发生停止运营的情形时，我们将以推送通知、公告形式通知您，并在合理的期限内删除您的个人信息或进行匿名化处理。</span><br>
      <span lang=ZH-CN style="font-weight: 400 !important;">注：法律法规有规定不能删除时或不能匿名化处理的情况除外。</span><br>
<br>
    <b>2.<span lang=ZH-CN>我们如何保护您的个人信息</span></b><br>
<br>
      <span lang=ZH-CN style="font-weight: 400 !important;">2.1、我们会严格按照《网络安全法》、《个人信息保护法》、《全国人民代表大会常务委员会关于加强网络信息保护的决定》、《电信和互联网用户个人信息保护规定》（工业和信息化部令第24号）、《电话用户真实身份信息登记规定》（工业和信息化部令第25号）等法律法规的要求，建立信息安全保障制度，采取技术措施和其他必要措施保护您的个人信息安全。</span><br>
<br>
      <span lang=ZH-CN style="font-weight: 400 !important;">2.2、我们只会在本政策所述目的所需的期限内保留您的个人信息。按国家政策法律法规要求或允许延长保留期限的除外。</span><br>
<br>
      <span style="font-weight: 400 !important;">2.3、请您理解：互联网环境并非百分百安全，我们会尽力确保或担保从您处获取的提供信息的安全性，但由于技术局限性以及可能存在的各种恶意手段，安全问题有可能因我们可控范围外的因素而出现。若不幸发生个人信息安全事件，我们将按照法律法规的要求，及时告知您安全事件的基本情况和可能的影响、我们已采取或将要采取的处置措施、您可自主防范和降低风险的建议、对您的补救措施等信息。我们将及时将事件相关情况以邮件、信函、电话、推送通知等方式告知您。在难以逐一告知个人信息主体时，我们会采取合理、有效的方式发布公告。同时，我们还将按照监管部门要求，主动上报个人信息安全事件的处置情况。</span><span
style='font-family:PingFang SC, Microsoft YaHe'><br>
<br>
</span>    <span style='font-family:PingFang SC, Microsoft YaHe'><b>3</b></span><span
style='font-family:PingFang SC, Microsoft YaHe'><b>.</b></span><span style='font-family:PingFang SC, Microsoft YaHe'><b><span
lang=ZH-CN>个人信息安全保护措施和能力</span></b></span><span style='font-family:PingFang SC, Microsoft YaHe'><br>
</span><br>
      <span lang=ZH-CN style="font-weight: 400 !important;">我们努力保障用户信息安全，以防止出现信息丢失、不当使用、未经授权访问或披露的情况。我们将在合理的安全范围内使用各种安全保护措施，并通过不断提升技术手段加强“一键呼叫APP”运行、使用过程中需在您终端上安装的软件的安全性，以防止您的个人信息泄露。</span></p>

<p class=MsoNormal align=center style='text-align:center'><span
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'><br>
<br>
</span><b><span lang=ZH-CN style='font-size:15.0pt;font-family:"PingFang SC, Microsoft YaHe"'>五、例外情况</span></b></p>

<p class=MsoNormal align=left style='text-align:left;font-weight: 400 !important;'><span style='font-size:
14px;font-family:"PingFang SC, Microsoft YaHe"'><br>
<br>
      <span style='font-family:PingFang SC, Microsoft YaHe'><span lang=ZH-CN>请您充分理解并同意，我们在以下情况下收集、使用您的个人信息无需您的授权，且我们可能不会响应您提出的更正/修改、删除、注销、撤回同意、索取信息的请求</span></p>

<p class="MsoNormal gnd" align=left style='text-align:left;text-indent:21.0pt'>    <span 
style='font-family:PingFang SC, Microsoft YaHe'>1.与国家安全、国防安全有关的情况。</span></p>

<p class="MsoNormal gnd" align=left style='text-align:left;text-indent:21.0pt'>    <span 
style='font-family:PingFang SC, Microsoft YaHe'>2.与公共安全、公共卫生、重大公共利益有关的情况。</span></p>

<p class="MsoNormal gnd" align=left style='text-align:left;text-indent:21.0pt'>    <span 
style='font-family:PingFang SC, Microsoft YaHe'>3.与犯罪侦查、起诉、审判和执行判决等有关的情况。</span></p>

<p class="MsoNormal gnd" align=left style='text-align:left;text-indent:21.0pt'>    <span 
style='font-family:PingFang SC, Microsoft YaHe'>4.有充分证据表明个人信息主体存在主观恶意或滥用权利的情况。</span></p>

<p class="MsoNormal gnd" align=left style='text-align:left;text-indent:21.0pt'>    <span 
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>5.出于维护个人信息主体或其他个人的生命、财产安全，但又很难得到本人同意的情况下。</span></p>

<p class="MsoNormal gnd" align=left style='text-align:left;text-indent:21.0pt'>    <span 
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>6.响应您的请求将导致您或其他个人、组织的合法权益受到严重损害的情况。</span></p>

<p class="MsoNormal gnd" align=left style='text-align:left;text-indent:21.0pt'>    <span 
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>7.涉及商业秘密的情况。</span></p>

<p class="MsoNormal gnd" align=left style='text-align:left;text-indent:21.0pt'>    <span 
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>8.所收集的个人信息是个人信息主体自行向社会公众公开的信息的情况。</span></p>

<p class="MsoNormal gnd" align=left style='text-align:left;text-indent:21.0pt'>    <span 
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>9.从合法公开披露的信息中收集的您的个人信息的情况，如合法的新闻报道、政府信息公开等渠道。</span></p>

<p class="MsoNormal gnd" align=left style='text-align:left;text-indent:21.0pt'>    <span 
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>10.与根据您的要求签订合同所必需的情况。</span></p>

<p class="MsoNormal gnd" align=left style='text-align:left;text-indent:21.0pt'>    <span 
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>11.用于维护所提供的产品与或服务的安全稳定运行所必需的情况，例如发现、处置产品与/或服务的故障。</span></p>

<p class="MsoNormal gnd" align=left style='text-align:left;text-indent:21.0pt'>    <span 
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>12.为合法的新闻报道所必需的情况。</span></p>

<p class="MsoNormal gnd" align=left style='text-align:left;text-indent:21.0pt'>    <span 
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>13.学术研究机构基于公共利益开展统计或学术研究所必要，且对外提供学术研究或描述的结果时，对结果中所包含的个人信息进行去标识化处理的。</span></p>

<p class="MsoNormal gnd" align=left style='text-align:left;text-indent:21.0pt'>    <span 
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>14.法律法规规定的其他情形。</span></p>

<p align=center style='text-align:center'><span style='font-family:"PingFang SC, Microsoft YaHe"'>&nbsp;</span></p>

<p align=center style='text-align:center'><span style='font-family:"PingFang SC, Microsoft YaHe"'><br>
</span><b><span lang=ZH-CN style='font-size:15.0pt;font-family:"PingFang SC, Microsoft YaHe"'>六、使用规则</span></b></p>

<p align=center style='text-align:center'><b><span style='font-size:15.0pt;
font-family:"PingFang SC, Microsoft YaHe"'>&nbsp;</span></b></p>

<p style='text-indent:21.0pt;word-break:break-all'>    <span lang=ZH-CN
style='font-family:"PingFang SC, Microsoft YaHe";font-weight: 400 !important;'>用户在使用一键呼叫的各项服务过程中，必须遵守以下原则，否则用户应承担一切责任，且浪潮数字企业技术有限公司有权终止服务：</span></p>

<p class="MsoNormal  ged" style='text-indent:21.0pt'>   <span lang=ZH-CN
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>遵守中国有关的法律和法规。</span></p>

<p class="MsoNormal  ged" style='text-indent:21.0pt'>   <span lang=ZH-CN
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>遵守测绘、地图等等相关的法律法规。</span></p>

<p class="MsoNormal  ged" style='text-indent:21.0pt'>   <span lang=ZH-CN
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>不得为任何非法目的而使用网络服务系统。</span></p>

<p class="MsoNormal ged" style='text-indent:21.0pt'>   <span lang=ZH-CN
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>遵守所有与网络服务有关的网络协议、规定和程序。</span></p>

<p class="MsoNormal ged" style='text-indent:21.0pt'>   <span lang=ZH-CN
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>不得利用我们各项服务进行任何可能对互联网的正常运转造成不利影响的行为。</span></p>

<p class="MsoNormal ged" style='text-indent:21.0pt'>   <span lang=ZH-CN
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>不得利用我们各项服务传输任何骚扰性的、中伤他人的、辱骂性的、恐吓性的、庸俗淫秽的或其他任何非法的信息资料。
</span>
</p>

<p class="MsoNormal ged" style='text-indent:21.0pt'>   <span style='font-family:PingFang SC, Microsoft YaHe'>不得利用我们各项服务进行任何不利于我们公司的行为。</span></p>

<p class="MsoNormal ged" style='text-indent:21.0pt'>   <span style='font-family:PingFang SC, Microsoft YaHe'>不得利用我们各项服务以任何形式侵害任何人之专利、商标、商业秘密、著作权或其他专属权利，不得侵害第三方合法权益。</span></p>

<p class='MsoNormal ged' style='text-indent:21.0pt'>    <span
lang=ZH-CN>其他我们认为不应从事或进行的行为。</span></p>

<p class=MsoNormal align=center style='text-align:center'><span
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>&nbsp;</span></p>

<p class=MsoNormal align=center style='text-align:center'><span
style='font-family:PingFang SC, Microsoft YaHe'><span style='font-size:14px;font-family:
"PingFang SC, Microsoft YaHe"'><br>
</span></span><span style='font-size:14px ;font-family:PingFang SC, Microsoft YaHe'><b><span
lang=ZH-CN style='font-size:15.0pt;font-family:"PingFang SC, Microsoft YaHe"'>七、</span></b></span><span
style='font-size:14px ;font-family:PingFang SC, Microsoft YaHe'><b><span lang=ZH-CN
style='font-size:15.0pt;font-family:"PingFang SC, Microsoft YaHe"'> </span></b></span><span
style='font-size:14px ;font-family:PingFang SC, Microsoft YaHe'><b><span lang=ZH-CN
style='font-size:15.0pt;font-family:"PingFang SC, Microsoft YaHe"'>未成年人隐私权保护特别约定</span></b></span></p>

<p class=MsoNormal align=left style='text-align:left'><span
style='font-family:PingFang SC, Microsoft YaHe'><b><span style='font-size:14px;font-family:
"PingFang SC, Microsoft YaHe"'>&nbsp;</span></b></span></p>

<p class=MsoNormal align=left style='text-align:left;
text-indent:21pt;font-weight: 400 !important;'>    <span
lang=ZH-CN >在数字化办公/学习、沟通与协同活动中我们推定您具有相应的民事行为能力。如果您为未成年人，我们要求您请您的父母或监护人阅读本政策，并在征得您父母或监护人同意的前提下使用我们的服务或向我们提供您的信息。如果您的监护人不同意您按照本政策使用我们的服务或向我们提供信息，请您立即终止使用我们的服务并及时通知我们，以便我们采取相应的措施。在您通知我们之前所受到的损害，我们不承担相应赔偿责任。我们将根据国家相关法律法规的规定保护未成年人的个人信息的保密性及安全性。</span></span></p>

<p class=MsoNormal align=left style='text-align:left'><b><span
style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>&nbsp;</span></b></p>

<p class=MsoNormal align=left style='text-align:left'></p>

<p class=MsoNormal align=center style='text-align:center'><span
style='font-size:14px ;font-family:PingFang SC, Microsoft YaHe'><b><span lang=ZH-CN
style='font-size:15.0pt;font-family:"PingFang SC, Microsoft YaHe"'>八</span></b></span><span
style='font-size:14px ;font-family:PingFang SC, Microsoft YaHe'><b><span lang=ZH-CN
style='font-size:15.0pt;font-family:"PingFang SC, Microsoft YaHe"'>、本政策如何更新</span></b></span></p>

<p class=MsoNormal align=left style='text-align:left;font-weight: 400 !important;'><span style='font-family:
PingFang SC, Microsoft YaHe'><span style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'><br>
</span></span><span style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>      <span
style='font-family:PingFang SC, Microsoft YaHe'><span lang=ZH-CN>我们的隐私政策可能变更。</span></span><span
style='font-family:PingFang SC, Microsoft YaHe'><br>
</span>      <span style='font-family:PingFang SC, Microsoft YaHe'><span class=msoDel>
</span></span><span style='font-family:PingFang SC, Microsoft YaHe'><span lang=ZH-CN>未经您的同意，我们不会削减您应享有的个人隐私权利。我们会以通告的形式发布对本政策所做的任何变更。在该种情况下，若您继续使用我们的服务，即表示您同意接受修订后的隐私政策约束。</span></span></span></p>

<p class=MsoNormal align=center style='text-align:center'><span
style='font-family:PingFang SC, Microsoft YaHe'><span style='font-size:14px;font-family:
"PingFang SC, Microsoft YaHe"'><br>
<br>
</span></span><span style='font-size:14px ;font-family:PingFang SC, Microsoft YaHe'><b><span
lang=ZH-CN style='font-size:15.0pt;font-family:"PingFang SC, Microsoft YaHe"'>九</span></b></span><span
style='font-size:14px ;font-family:PingFang SC, Microsoft YaHe'><b><span lang=ZH-CN
style='font-size:15.0pt;font-family:"PingFang SC, Microsoft YaHe"'>、如何联系我们</span></b></span></p>

<p class=MsoNormal align=left style='text-align:left;font-weight: 400 !important;'><span style='font-family:
PingFang SC, Microsoft YaHe'><span style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'><br>
</span></span><span style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>      <span
style='font-family:PingFang SC, Microsoft YaHe'><span lang=ZH-CN>注册公司：浪潮数字企业技术有限公司</span></span><span
style='font-family:PingFang SC, Microsoft YaHe'><br>
</span>      <span style='font-family:PingFang SC, Microsoft YaHe'><span lang=ZH-CN>公司注册地址：山东省济南市历下区浪潮路</span></span><span
style='font-family:PingFang SC, Microsoft YaHe'>1036</span><span style='font-family:PingFang SC, Microsoft YaHe'><span
lang=ZH-CN>号</span></span><span style='font-family:PingFang SC, Microsoft YaHe'><br>
</span>      <span style='font-family:PingFang SC, Microsoft YaHe'><span lang=ZH-CN>负责团队：中央大客户事业部</span></span><span
style='font-family:PingFang SC, Microsoft YaHe'>-</span><span style='font-family:PingFang SC, Microsoft YaHe'><span
lang=ZH-CN>移动</span></span><span style='font-family:PingFang SC, Microsoft YaHe'>ABU-</span><span
style='font-family:PingFang SC, Microsoft YaHe'><span lang=ZH-CN>国资监管组</span></span></span></p>

<p class=MsoNormal align=left style='text-align:left;text-indent:21.0pt'>  <span
style='font-family:PingFang SC, Microsoft YaHe'><span lang=ZH-CN style='font-size:14px;
font-family:"PingFang SC, Microsoft YaHe";font-weight: 100 !important;'>联系方式：</span></span></p>

<p class=MsoNormal><span style='font-size:14px;font-family:"PingFang SC, Microsoft YaHe"'>&nbsp;</span></p>

</div>

<div>
<div>

</div>

</div>

<div>
</div>

</div>

<div>
</div>

</div>

</div>

</body>

</html>

`

const htmlData = {
  LangchaoUserPrivacyPolicy_CN,
  LangchaoUserPrivacyPolicy_EN,
}

function getHtml(): typeof htmlData {
  return htmlData
}

export {
  getJson,
  getHtml,
}
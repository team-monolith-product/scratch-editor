const ArgumentType = require("../../extension-support/argument-type");
const BlockType = require("../../extension-support/block-type");
const Base64Util = require("../../util/base64-util");
const cast = require("../../util/cast");
const formatMessage = require("format-message");

const GCubeProtocol = require("../../extension-support/roborisen-support");

const iconURI =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAIAAAABc2X6AAAACXBIWXMAAC4jAAAuIwF4pT92AAAF+mlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE5LTA2LTA0VDE0OjAwOjM1KzA5OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDE5LTA2LTA0VDE0OjAwOjM1KzA5OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxOS0wNi0wNFQxNDowMDozNSswOTowMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoyNmUzZGY0MS1jZjUyLTY0NGEtYTcxNy02ODQ4NDIyNmQ3N2IiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo5MTYyMzk1My0xMTk2LTNjNDItODhkMy0xYmI1NmZjNDdjYWYiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpmMzg4MDZmMS0wMTE0LWZmNDktOTJmZC1jNjJiNDM1NzI2OWEiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmYzODgwNmYxLTAxMTQtZmY0OS05MmZkLWM2MmI0MzU3MjY5YSIgc3RFdnQ6d2hlbj0iMjAxOS0wNi0wNFQxNDowMDozNSswOTowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDoyNmUzZGY0MS1jZjUyLTY0NGEtYTcxNy02ODQ4NDIyNmQ3N2IiIHN0RXZ0OndoZW49IjIwMTktMDYtMDRUMTQ6MDA6MzUrMDk6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7mspeEAAAQh0lEQVR4nN1ceZQURZr/RURmVlZlVvVRTVc30JyKHA26iCggIuB4jngMrDCAIujoMOqoMzvjuuM8xwt1x3OcYRyVp+IB4riIAuIBLoKCuiqLtnIfDfTdXdVdZ2ZGxP5R1dBAQ1V1FwL7e/Vev+qqyPp++R3xxRdfBgm/3w3HAIaHwEdhAzHZEha7aviuaqc2KOqCnPODvskYSgqYP4+WBVifUsU0CNwUKkGIR2Iy54IpubqQlCAEhpfCTeBg3257/X/Hvt5sf/ZdYnOlUx8U0UQa6XWNFBfQvl2VEeXa0H7aqMFaSTcVChCXkRaRvH7nQTqvYSng0ohaQKGQ6u32qq/ib66KfVZhVdXz9IOPjG5d2JA+6s/GuC8bpZf01WBLOygSluwk7U4RlhIulahFDEJ++mn85RWRJWviVQ2d4nk4Svxswih9xiXGiHN0KMSucxJ2x7XdQcJSglG4CxmEXLk+8fTClrc/iXVQhIxx+Sj3rMuNK8Z7wBCr57xDRt4RwlLA9BGYdP36xEMvNS9Zc8yptsVVY9x3TfcNP0dHiwiHBKHZDc+OsJSgFJ4SpbmW3/986M+vt2T3a7nD7ZO998zyFQaUWK3DeRaqzoKwFDA8hHRhH6+M/WJO45Y9TgeFzRF6l7AX/uAfe74bjTwclRmqOlODEAJmASUGffDx4Nhf1R53tgB2VPNxt9Te/0QQXmr6mRAZjcpIw1LADLB4s5hxX+PCj6KdlTTXmDTW8+K9hR4fDdfwtHrOQMMSZgnbt5eP/WXtCcgWwKJV0XE31e7e7ZglDOn0nI6whFHCdmy1R99Ys67CypWIOcf6H6wxN9Xs3GYbJQxHzeiOSljAKGbbt9jn3Vy7ver4O+3RsbOanz+7tnKnYxxVz0ckLAWMIhqs4xfdVrenc0nij4ZdNXzc7Nr6Km4EmDiCyO0TFgJmPnUSmPCb+q37TnTdtsXWfc6Vv62zY9IsoO3G7XYISwmXCzDpjfc1fLIxccxlzDXWfmvdeG8DMajL1U460g5hSqCVKs+92PziihMxJmeCl96Pzp0X0rqwwz86dB6WAmYx27LFGjClmmc2lZ+wqJhfMqBcO2RyPkjDUsKlE3Dc8FDTyc4WwPVzGpGQupvINhPVQYQpoPrZM/ObV284+Vz3cKyvsJ56tUXpwlgbXz5g0lLCyKPV1bz/1KrmSO6LSccFeSbd+HKgrJsSDorkiuqAhlUKYtAHXmr+f8MWQCgsHn2lBXlUaSWa+islXPl028bE398OHzfpjg1eeDdSVWHp+TTpySnCjAAmffbdSIaLrJMIMUs+trAFBk1STfmw4aXBJtF/WlVNYwcZl/rZsNO0fmWstIjFLeyrd+qDYsN2Z0ul3eGbWOCl117ssexUlNVVGrfFvKURy87uOnkG3bqgpKiIRVqEAkBKwEtfWdDSAbYEmH6xMeVC9/B+WmEhg0GgEwggJpGQsYjYUuksWRt/+b1IB2oGN15uPDLHjwaRWgAF2BfLos8tiWR7nVBELPwo+quZebJZKABcKhATC1ZmnVddcJZrzuz8YSN0JCRahJ2QTlQkK0yMgRGia2RIuWvIKPedk73/WBy+d15zKJrpPSUEU8d70CQSTRwAAdE85Ok3WzqWIDy/NHLzRK/GQAGoeaziO+vTb7Nb7v5huu+DZwPDhunxPU64mkei0rKlEKl6GuewHBmNy3AjD++wPQa5/Za8dS8UDx+gZXj9keXakCEuq1E4HA6HapC6LfbSdfEsmabwzRb7m4qEVpD0ZIblX8RlNpPRk7fm3393ASIivNfh4kDRkFK4VKJrRFNI8p+EgBCEm0V4l9N/oLb+zdIxZ7gy+Ykp4z3wEMuWACBBPGTZunhTc8eD6vtfJqAQSglgyWXZ3LnHfpn369l5iSpnf61QSrg0YgSYuwtTFBAC1U08XRWjgDGC5K1UKMDIJ6uiu2vSr669bnL1aDfCqWyBUSAuX1qetfe2xfJ1cbRIxe0meyr5V5syDXxTL/DceWu+U8ttG4RASlACo5glGvnityPrvrN+2G3HLOn3sUG9lUvO1oefqcORsZDQS9iSpZGr7qoXGZjS5ee6S/tpiZpUnNN99Icf7NUbEozi7um+4kKWsCQA3SRfbbTmLcvoRny5ydq1z1HgZd+siQfDGZlKoJDOvasAURmPSUIhJTSVaAG28oPo7+eGvtx0UBRYtAr3zmueepFnzs15ZWfp777WcsXv6zP5FQDXjPMA0uYgBASAh/zXmhgX8BnkP671uvpqaBEAUMJWLwxnSDiWkF9vsRRAbtyeqXr/fZrP20ON7rCTbFUFWhF78tnQHU8HjzTk1RXRtRsSs6f47nmmKcNf6RFgPxmmoyllz5oCNImFK6MACMHuGn6q7kQiAoDhyJrGLMpPG7fbFBG5qTKjGbK4gF53kQf1XLRm4a4u7MUFLUdhm8TOav67J5oSGWcLE8/3uLuyWEICkBJKPvu8wtqw1U6+7Qw2VzrUSchNuzOS5eox7vwyNREVBJAS7gK67Xv7pv9s7JQI7eFfx3oQl8n5llFAJW+tzs1+3e4aTuOWrKrPyIFHlrtAYXMAUBmIizwyvznbLC8tzh3sOnuIZgd50p51F4lWOYs+zg3hnTWc1gVFczS9GzCG/j0URFJ+5dJJw66cydEWU3/igY9aHEi2UfjYx18ntueoctoQEkowLOJWes/IM0ipn2F/GHaRb3fZ7cZ2XSPP/a6wTxmLRdNc1p1P3/4g+uhrB/ZcTTe58lxdNqcUoDJAxT9zZM8ApJRKXVDEMqjn+DzM76OO08pBJXvr2rcLheGSc3T/QBVps6KAEm7gbQlfOkIv6a3GWq/s8tBwpbP0sw6mk+2LRzPbSk5miAcgQY8wUkpUNXB/DY20pCFsCNQGD/rOjAsNILVPIiVg0nfei7adeA5PWrIN25nuD4ciorZJKGrre44u+Vk2G7SHSPyAwKd2V8aN0HnrbdJUIhLi8TcOajIIRyUXwP5bTZHIwB/bQuGZfT8UFnVB0aNMSd3ThBzSW8k36eFuTAhK/QwBZrgPNgGBWAPnHMn0mxBAYk8bv5gy3uMKKOFddip/ZghV84vP1keVuzQVABI2fAbJM6nTStIJi/Le6u2TvG6TbPjBWpaB8Sv5JtUUYjlpeHOBLXudM0e6ZAiEIBEXXXpql43QX/3g0FW0w7F8XbzPXvuQoBVLyJGDNMOkji0BEAlI+fXmA9noNWPd+2cBALG41Fzk/tvyoZJWyyUQMt7AYwmZ9KdYszz9FPWJewoRYIufD2VEOM8gLg1WBmF/zf8mJk80FQouYTtwOfLfpngPJxy35PQHGg4fXt5b/Xx+QBFwbADQPbRuH//suxThMWe4Bg7UnDZun2Qeaa/ra3/0oAyxhES1YziyPpQ+m5AStNBL3a6MvPGdtbHIHkd306Q0sQZ++jD9qdvyMxnr1sgbD/rdOom1tk+SPPLe+nhjayS/ZpwHJo2na0/sJPIMSgt9tHt7m06HY3cNf+2jKPw0aV8ciDc4t830/ekG39EHBgroiseLBpS7og2CEEhAU4GI/Nvi8H45rj7PjZBgFJSkeR0CklQ4yahzqSzAKFPQqzQjwgAemt8cr+FGPk22ejoJ2CHxxzsKFj7gH9hLbXfIFaPda/4eGD3GE61yktqkEmpAeX1pZF2rPc+8zAic7gKD20vTvExKyYElhBRQFOL2UvioR0/PuGeAEflVj3ueCj7wUnOGnGdfYf71sSKr0rEsmSwAqApcJUqshr/xYXTF57EdVRwAozhnkGvCKP28kW4A4XoOAtLaENRYwwdMrto/CQ/spRb6mR0TabVk6OSFuwq7B5R4XADQ8+mqtfF7ng9RhdTW861704Siu6Z5FagY1CuLJuK/vR0eepo664Y8VNqWA0LgcNiVjmmS6yaa111pHOivYAQMVlBYVqoSJAS8hRQEM+5raJtyVOy0sTPTVUgsIVmrvMxF9tXz/ZaSFqd0UxTEMKCnqjA4GS+kb3i0iVDMnOFjNTwal5SAUESiElGeKlAAAGTr8jW1PSvh7cJAcP3v69/5tIPZos8gjLZJrwTc7W3ztwtKcFZ/jVphXn6KOrhv+x54JMx6uOnxv4aYh3iLGNoIICVE6+uApyVLfGXK7krn0ptrj1djwaDe6uDeKrVtMB8dP1TPdvxv/hK86s76rdsso1Qxi1N5VduKRLIT1fBRs5uiqOTF11qGXlu9/PNcrgSywgXDXCSPKiCAxISR7j8vyLo1dvEnsRXr47MmGFPGef7lVNXoqkACXEICBFAJLLm30lm1LPL0ovAX3+egr41S9AwwdFeM1iJeSWGmU8yFZ+kgIOH3u7l14kiUT63uTMtoeW91cF+1bzeltJBpKgmG+Y4qXlnD11VYdcGctXmpCi4arpseyrkEwFykci9fm0GrUVkx2/RaiaoQhN/vFl7RTVb0vHtamvzhpMYdk0z5TY/wim7JlQsQkddd7FEytY6TDIxi1mUGHIC0roetZtFviOunI93HV7JjhCtHuwcN1RNBjv0FAMuRgLz9Z+ZxFexY4dcTvUCq3poiTAjsejFmtHvcmRlt7Z1EGDvUNXqUbjfwQ7t4ErYExZwb8o6baMcGD/8ir20l6ABhQpCo58NH6rMuNY6TbLnHzEs9w0fqVj0/sIPd9mNbQMbkw7fk+305KNAdd+R76SOz8xGTVps84CBihCASFEW9lLl3FvzY0h0D/OXW/KJeaiR40KrzUE0SikSVM2mSMfNiz48qXa4x7QLPtMneRI0jD15NtfMYj5AwfTTu4OwZ1Ru35Xqz7EdBvzLl61dK3RoizYcWFdpvEI+EhNtHljxclGfm4pndHxeFPrr88S6ePBIJtVNCaT84EYpoNe81UFv8UNExFzCnYBRvPVjUZ7AWPcJDW0eMxgKI7XPOH+9ZdJ//GAqYa7z1oH/MBe5YpXOkIvURCRMCLhCrciZONBfcf3JwXvSAf8IEM3pw69ghONp8SwgER3Sfc81E862H/bp24vqzQvHPOUUTrzajVY446tO16RIMAsER2+NcdaW56pkuPQMn4gKyZ4Ctnlt89RVGbJ8j0z1LnD6jStn2buecke61/ygeO/TEWl2MP9O15rnAiNHu2B6H8zY7qUdARikkIeBAeK/Trbu6cm7gj9efKLWRu6f7PnymuHt3JVzpcGS025LlI/ECpkHgZ2tWxW5/Kvg/m4/b86ZnnKI+eXv+mDEeBEU4ksVJAFkfepBsrvQEWLxRPLGg5dFXWzJsW8wVCkz6259775hsuv0sWsvFkQNyu+j4sRamQZDPdn5vPflGy/z3oo3pOjo6jzyDzrzMc+tEb+9yDY08HM70uf+26PjBJSlV51OYtHqzNW9Z9PUPo99m3LaZFfr3VH5+oXHthZ6e5RpaRDQoREdPquns0TSpgy58FCZN1Djvro2//mH002+tnJzXUupnowZrk873/PRc3dNVQVhEQyJbGz4EOTiLJwkpYXoIvBQOqvc4q76Kf/adtXpDorKWN2bTxu4zSO9SZdyZrrP7a+edoZeWKWBARIQjnT2FJ4mcEW6L1NlScSlisrLWqdjpbNvr7K3je+t5U7NIOKhq4EKAUZT4mcqQZ9Jepax7F6VHgJ1WpvTpqjCDQKcI8Ui6dr5s8X/GVlsjZ8PwlwAAAABJRU5ErkJggg==";

const bleNusServiceUUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
const bleNusCharRXUUID = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";
const bleNusCharTXUUID = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";

const wormBotScheduledData =
    "ff,ff,ff,aa,20,0,cd,2,43,2,3,0,0,ff,ff,ff,0,0,0,ca,1,1b,2,3,0,1,c5,17,fc,a5,0,f8,3,5b,0,f8,fc,7c,0,f8,0,0,2,58,3,5b,0,f8,fc,7c,0,f8,0,0,2,58,3,5b,0,f8,0,0,2,58,0,0,3,20,fc,a5,0,f8,0,0,2,58,3,84,0,f8,fc,a5,0,f8,0,0,2,58,3,84,0,f8,fc,a5,0,f8,0,0,2,58,3,5b,0,f8,0,0,3,20,fc,41,1,ef,3,97,1,ef,3,97,1,ef,1,1a,0,6e,fc,48,2,5d,0,0,2,26,2,ff,0,a5,fd,5c,0,a5,0,0,3,20,fc,f2,0,dc,2,b3,0,dc,1,1a,0,6e,3,3c,1,4a,fc,80,1,b8,fc,23,1,ef,3,dd,1,ef,0,0,2,bc,0,0,3,20,fc,41,1,ef,3,97,1,ef,0,0,3,20,fc,23,1,ef,3,dd,1,ef,0,0,2,bc,0,0,3,20,2,b9,0,f8,fc,8d,0,8a,3,73,0,8a,fc,8d,0,8a,3,73,0,8a,fc,7d,1,f0,3,73,0,8a,fc,8d,0,8a,3,73,0,8a,fc,8d,0,8a,fc,7e,0,f7,3,82,1,ef,fc,7d,0,f8,3,ab,1,f0,fc,55,1,f0,3,ab,1,f0,fc,55,0,f8,fc,23,1,ef,3,dd,1,ef,0,0,2,bc,0,0,3,20,0,0,3,e8,ff,ff,ff,1,0,0,ca,1,1b,2,3,0,1,48,bf,fc,a5,0,f8,0,0,2,58,3,84,0,f8,fc,a5,0,f8,0,0,2,58,3,84,0,f8,fc,a5,0,f8,0,0,2,58,3,5b,0,f8,0,0,3,20,fc,a5,0,f8,3,5b,0,f8,fc,7c,0,f8,0,0,2,58,3,5b,0,f8,fc,7c,0,f8,0,0,2,58,3,5b,0,f8,0,0,2,58,0,0,3,20,fc,f2,0,dc,2,b3,0,dc,1,1a,0,6e,3,3c,1,4a,fc,80,1,b8,fc,23,1,ef,3,dd,1,ef,0,0,2,bc,0,0,3,20,fc,41,1,ef,3,97,1,ef,3,97,1,ef,1,1a,0,6e,fc,48,2,5d,0,0,2,26,2,ff,0,a5,fd,5c,0,a5,0,0,3,20,fc,f2,0,dc,2,b3,0,dc,0,0,3,20,0,0,2,26,2,ff,0,a5,fd,5c,0,a5,0,0,3,20,2,b9,0,f8,fc,8d,0,8a,3,73,0,8a,fc,8d,0,8a,3,73,0,8a,fc,7d,1,f0,3,73,0,8a,fc,8d,0,8a,3,73,0,8a,fc,8d,0,8a,fd,20,0,89,3,49,1,81,3,83,0,f8,fc,55,1,f0,3,ab,1,f0,fc,55,1,f0,3,ab,0,f8,0,0,2,26,2,ff,0,a5,fd,5c,0,a5,0,0,3,20,0,0,3,e8";

class Gcube4 {
    constructor(runtime, extensionId) {
        this._runtime = runtime;
        this._extensionId = extensionId;
    }
}

class RoborisenGCube4Blocks {
    static get EXTENSION_ID() {
        return "gcube4";
    }

    constructor(runtime) {
        this.runtime = runtime;
        this._peripheral = new Gcube4(
            this.runtime,
            RoborisenGCube4Blocks.EXTENSION_ID
        );

        this._mDevice = null;
        this.rxCharacteristic = null;
        this.txCharacteristic = null;
        this.queue = [];
        this.cubeNum = 4;
        this.inActionCube = false;
        this.allConnect = false;
        this.cancle = false;
    }

    get CUBENUM() {
        return [
            {
                text: formatMessage({
                    id: "roborisen.cube.1",
                    default: "1번",
                    description: "1",
                }),
                value: 0,
            },
            {
                text: formatMessage({
                    id: "roborisen.cube.2",
                    default: "2번",
                    description: "2",
                }),
                value: 1,
            },
            {
                text: formatMessage({
                    id: "roborisen.cube.3",
                    default: "3번",
                    description: "3",
                }),
                value: 2,
            },
            {
                text: formatMessage({
                    id: "roborisen.cube.4",
                    default: "4번",
                    description: "4",
                }),
                value: 3,
            },
            {
                text: formatMessage({
                    id: "roborisen.cube.all",
                    default: "모든",
                    description: "all",
                }),
                value: 0xff,
            },
        ];
    }

    async enqueue(data) {
        // console.log(`Send : ${String(PingPongUtil.byteToString(data))}`)
        for (let i = 0; i < data.length; i += 20) {
            const chunk = data.slice(i, i + 20);
            this.queue.push(chunk);
        }
        await this.processQueue();
    }

    async processQueue() {
        if (this.isSending || this.queue.length === 0) {
            return;
        }

        this.isSending = true;

        while (this.queue.length > 0) {
            const dataChunk = this.queue.shift();
            await this.sendData(dataChunk);
        }

        this.isSending = false;
    }

    async sendData(packet) {
        try{
            await this.rxCharacteristic?.writeValue(packet);
        } catch (e) {
            console.log('sendErr',e);
        }
    }

    getInfo() {
        return {
            id: RoborisenGCube4Blocks.EXTENSION_ID,
            name: "GCube4",
            blockIconURI: iconURI,
            showStatusButton: false,
            //#region blocks
            blocks: [
                {
                    opcode: "connectCube",
                    text: formatMessage({
                        id: "roborisen.connectCube",
                        default: "연결하기",
                        description: "connectCube",
                    }),
                    blockType: BlockType.COMMAND,
                },
                {
                    opcode: "disconnectCube",
                    text: formatMessage({
                        id: "roborisen.disconnectCube",
                        default: "연결 끊기",
                        description: "disconnectCube",
                    }),
                    blockType: BlockType.COMMAND,
                },
                {
                    opcode: "changeLED",
                    text: formatMessage({
                        id: "roborisen.changeLED",
                        default:
                            "[CUBE] 큐브의 LED 색 바꾸기 - Red :[RED], Green :[GREEN], Blue :[BLUE]",
                        description: "changeLED",
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        CUBE: {
                            type: ArgumentType.NUMBER,
                            menu: "cube",
                            defaultValue: this.CUBENUM[0].value,
                        },
                        RED: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0,
                        },
                        GREEN: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0,
                        },
                        BLUE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0,
                        },
                    },
                },
                {
                    opcode: "setContinuous",
                    text: formatMessage({
                        id: "roborisen.setContinuous",
                        default: "[CUBE] 큐브를 [SPEED]의 속도로 계속 회전하기",
                        description: "setContinuous",
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        CUBE: {
                            type: ArgumentType.NUMBER,
                            menu: "cube",
                            defaultValue: this.CUBENUM[0].value,
                        },
                        SPEED: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0,
                        },
                    },
                },
                {
                    opcode: "setStep",
                    text: formatMessage({
                        id: "roborisen.setStep",
                        default:
                            "[CUBE] 큐브를 [SPEED]의 속도로 [STEP]도 만큼 회전하기",
                        description: "setStep",
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        CUBE: {
                            type: ArgumentType.NUMBER,
                            menu: "cube",
                            defaultValue: this.CUBENUM[0].value,
                        },
                        SPEED: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0,
                        },
                        STEP: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0,
                        },
                    },
                },
                "---",
                {
                    opcode: "setMatrixXY",
                    text: formatMessage({
                        id: "roborisen.setMatrixXY",
                        default:
                            "[CUBE] 큐브의 매트릭스 제어 - X :[X], Y :[Y], On/Off :[ONOFF]",
                        description: "setMatrixXY",
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        CUBE: {
                            type: ArgumentType.NUMBER,
                            menu: "cube",
                            defaultValue: this.CUBENUM[0].value,
                        },
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0,
                        },
                        Y: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0,
                        },
                        ONOFF: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0,
                        },
                    },
                },
                {
                    opcode: "setMatrix8",
                    text: formatMessage({
                        id: "roborisen.setMatrix8",
                        default: "[CUBE] 큐브의 매트릭스 제어 - [MATRIX8]",
                        description: "setMatrix8",
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        CUBE: {
                            type: ArgumentType.NUMBER,
                            menu: "cube",
                            defaultValue: this.CUBENUM[0].value,
                        },
                        MATRIX8: {
                            type: ArgumentType.MATRIX8,
                            defaultValue:
                                "1000000001000000001000000001000000000000000000000000000000000000",
                        },
                    },
                },
            ],
            menus: {
                cube: this.CUBENUM,
            },
        };
    }
    //#region Function
    async connectCube() {
        let groupID;
        do {
            groupID = prompt(
                "그룹번호를 입력해주세요(0~76)\n(그룹번호가 없으면 취소)"
            );
            if (groupID === null) {
                break;
            } else if (isNaN(groupID)) {
                alert("입력값은 숫자여야 합니다.");
            } else if (!Number.isInteger(Number(groupID))) {
                alert("입력값은 정수여야 합니다.");
            } else if (groupID < 0 || 76 < groupID) {
                alert("값이 0~76 여야 합니다.");
            } else if (groupID[0] === groupID[1]) {
                alert("두 자리는 서로 다른 숫자여야 합니다.");
            }
        } while (
            isNaN(groupID) ||
            !Number.isInteger(Number(groupID)) ||
            groupID < 0 ||
            76 < groupID ||
            groupID[0] === groupID[1]
        );

        try {
            let findID;
            findID =
                !groupID || groupID == 0
                    ? `PINGPONG`
                    : `PINGPONG.${groupID.padStart(2, "0")}`;
            console.log(`find ${findID}`);
            this._mDevice = await navigator.bluetooth.requestDevice({
                filters: [{ namePrefix: findID }],
                optionalServices: [bleNusServiceUUID],
            });

            this._server = await this._mDevice.gatt.connect();
            console.log("Cube connected:", this._server);

            const service = await this._server.getPrimaryService(
                bleNusServiceUUID
            );

            this.rxCharacteristic = await service.getCharacteristic(
                bleNusCharRXUUID
            );
            this.txCharacteristic = await service.getCharacteristic(
                bleNusCharTXUUID
            );
            await this.txCharacteristic.startNotifications();

            this.txCharacteristic.addEventListener(
                "characteristicvaluechanged",
                this.handleNotifications.bind(this)
            );
            this._mDevice.addEventListener(
                "gattserverdisconnected",
                async () => {
                    console.log("Cube disconnected");
                    this.rxCharacteristic = null;
                    this.txCharacteristic = null;
                }
            );
            if (!groupID) {
                groupID = "00";
            }
            this.enqueue(
                GCubeProtocol.getSetMultiroleInAction(this.cubeNum, groupID)
            );
            const waitUntilConnected = async () => {
                while (!this.allConnect) {
                    if (this.cancle) {
                        this.cancle = false;
                        return;
                    }
                    await new Promise((resolve) => setTimeout(resolve, 100));
                }
            };
            await waitUntilConnected();
        } catch (error) {
            // console.error('Error connecting to Cube:', error);
        }
    }

    async disconnectCube() {
        this.enqueue(GCubeProtocol.rebootMultiroleAggregator());
        this.allConnect = false;
        this.cancle = true;
    }

    handleNotifications(event) {
        const value = event.target.value;

        if (value.byteLength !== 0) {
            console.log(
                `Receive ${String(GCubeProtocol.byteToStringReceive(event))}`
            );
        }

        if (this.allConnect && value.getUint8(6) == 0xad) {
            this.disconnectCube();
        }

        if (value.getUint8(6) == 0xad && value.getUint8(9) == this.cubeNum-1) {
            console.log("connected complete");
            this.allConnect = true;
        }
    }

    changeLED(args) {
        if (this.inActionCube === true) return;
        this.inActionCube = true;

        const ColorLEDData = GCubeProtocol.makeColorLEDData(
            args.CUBE,
            args.RED,
            args.GREEN,
            args.BLUE
        );

        this.enqueue(ColorLEDData);

        return new Promise((resolve) => {
            const repeat = setInterval(() => {
                this.inActionCube = false;
                clearInterval(repeat);
                resolve();
            }, 64);
        });
    }

    setContinuous(args) {
        // console.log('setContinuous');
        if (this.inActionCube === true) return;
        this.inActionCube = true;

        const makeContinuousData = GCubeProtocol.makeContinuousData(
            args.CUBE,
            this.cubeNum,
            GCubeProtocol.changeSpeedToSps(args.SPEED)
        );

        this.enqueue(makeContinuousData);

        return new Promise((resolve) => {
            const repeat = setInterval(() => {
                this.inActionCube = false;
                clearInterval(repeat);
                resolve();
            }, 64);
        });
    }

    setStep(args) {
        if (this.inActionCube === true) return;
        this.inActionCube = true;
        const speed = GCubeProtocol.changeSpeedToSps(args.SPEED);
        const step = GCubeProtocol.changeDegreeToStep(args.STEP);
        let delay = GCubeProtocol.makeDelayTimeFromSpeedStep(speed, step);
        const makeSingleStepData = GCubeProtocol.makeSingleStep(
            args.CUBE,
            this.cubeNum,
            speed,
            step
        );

        this.enqueue(makeSingleStepData);

        return new Promise((resolve) => {
            const repeat = setInterval(() => {
                this.inActionCube = false;
                clearInterval(repeat);
                resolve();
            }, delay);
        });
    }

    async setMatrixXY(args) {
        if (this.inActionCube === true) return;
        this.inActionCube = true;

        const makeMatrixXYData = GCubeProtocol.makeMatrixXY(
            args.CUBE,
            this.cubeNum,
            args.X,
            7 - args.Y,
            args.ONOFF
        );
        await this.enqueue(makeMatrixXYData);

        console.log(
            `Receive ${String(GCubeProtocol.byteToString(makeMatrixXYData))}`
        );
        return new Promise((resolve) => {
            const repeat = setInterval(() => {
                this.inActionCube = false;
                clearInterval(repeat);
                resolve();
            }, 64);
        });
    }

    async setMatrix8(args) {
        if (this.inActionCube === true) return;
        this.inActionCube = true;

        const argData = cast.toString(args.MATRIX8).replace(/\s/g, "");

        if (argData !== null) {
            const splitData = argData.split("");
            const pictureData = new Uint8Array(8).fill(0);

            for (let i = 0; i < 8; i++) {
                for (let j = 0; j < 8; j++) {
                    pictureData[(i + 1) % 8] +=
                        splitData[j + 8 * (7 - i)] * Math.pow(2, 7 - j);
                }
            }

            const makeMatrix8Data = GCubeProtocol.makeMatrixPictureData(
                args.CUBE,
                this.cubeNum,
                pictureData
            );
            await this.enqueue(makeMatrix8Data);
            console.log(
                `Receive ${String(GCubeProtocol.byteToString(makeMatrix8Data))}`
            );
        }

        return new Promise((resolve) => {
            const repeat = setInterval(() => {
                this.inActionCube = false;
                clearInterval(repeat);
                resolve();
            }, 64);
        });
    }
}

module.exports = RoborisenGCube4Blocks;

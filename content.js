var _0x343d=['local','html','storage','runtime','alt','0.9','encrypted','image','Missing\x20text\x20or\x20HTML,\x20please\x20contact\x20the\x20Scavenger\x20Hunt\x20manager','href','Missing\x20submit\x20key,\x20please\x20contact\x20the\x20Scavenger\x20Hunt\x20manager','charAt','always','length','found','Missing\x20URL,\x20please\x20contact\x20the\x20Scavenger\x20Hunt\x20manager','error','cors','includes','Missing\x20ID,\x20please\x20contact\x20the\x20Scavenger\x20Hunt\x20manager','clues','match','json','Please\x20set\x20or\x20reset\x20the\x20Scavenger\x20Hunt\x20source\x20in\x20Options.','sourceJson','location','Unknown\x20json\x20error,\x20please\x20contact\x20the\x20Scavenger\x20Hunt\x20manager.\x20Source\x20data:\x20','key','set','text','get','url','clueobject','silent','interact','prompt','version','sendMessage','then'];(function(_0x49b1ef,_0x343d19){var _0x378856=function(_0x49ba87){while(--_0x49ba87){_0x49b1ef['push'](_0x49b1ef['shift']());}};_0x378856(++_0x343d19);}(_0x343d,0xa3));var _0x3788=function(_0x49b1ef,_0x343d19){_0x49b1ef=_0x49b1ef-0x0;var _0x378856=_0x343d[_0x49b1ef];return _0x378856;};function checkForUpdates(){var _0x30c5cf=_0x3788;chrome[_0x30c5cf('0x22')][_0x30c5cf('0x20')]['get']({'sourceUpdates':![]},function(_0x49ba87){var _0x59001f=_0x30c5cf;_0x49ba87['sourceUpdates']?chrome[_0x59001f('0x22')][_0x59001f('0x20')]['get']({'sourceJson':chrome[_0x59001f('0x23')]['getURL']('res/hunt.json')},function(_0x1b1775){var _0x53d02a=_0x59001f;getClues(_0x1b1775[_0x53d02a('0x11')]);}):handleJson();});}async function getClues(_0x36e150){var _0x1d7f02=_0x3788;try{fetch(_0x36e150,{'mode':_0x1d7f02('0xa')})[_0x1d7f02('0x1f')](_0x59876d=>_0x59876d[_0x1d7f02('0xf')]())[_0x1d7f02('0x1f')](function(_0x59a67f){var _0x3b62e7=_0x1d7f02;chrome[_0x3b62e7('0x22')][_0x3b62e7('0x20')][_0x3b62e7('0x15')]({'sourceUpdates':![],'clueobject':_0x59a67f,'maxId':getMaxId(_0x59a67f[_0x3b62e7('0xd')])},function(){handleJson();});});}catch(_0x4a9efe){console[_0x1d7f02('0x9')](_0x4a9efe);}}function getMaxId(_0x30db36){var _0x2091fc=_0x3788,_0x14a2e9=0x0;for(var _0x4dadf2=0x0;_0x4dadf2<_0x30db36[_0x2091fc('0x6')];_0x4dadf2++){_0x30db36[_0x4dadf2]['id']>_0x14a2e9&&(_0x14a2e9=_0x30db36[_0x4dadf2]['id']);}return _0x14a2e9;}function handleJson(){var _0x3c53cd=_0x3788,_0x1130ed={};hunt_data='';try{chrome[_0x3c53cd('0x22')][_0x3c53cd('0x20')][_0x3c53cd('0x17')]({'clueobject':''},function(_0x4b192d){var _0x57630e=_0x3c53cd;hunt_data=_0x4b192d['clueobject'];var _0x40b5b9=hunt_data[_0x57630e('0xd')],_0x4d0eec=hunt_data['encrypted'];_0x4d0eec==undefined&&(_0x4d0eec=![]);if(_0x40b5b9==undefined||hunt_data=='')_0x1130ed[_0x57630e('0x9')]=_0x57630e('0x10');else for(var _0x1928c4=0x0;_0x1928c4<_0x40b5b9[_0x57630e('0x6')];_0x1928c4++){var _0x58ca84=_0x40b5b9[_0x1928c4];if(_0x58ca84['id']==undefined){_0x1130ed[_0x57630e('0x9')]=_0x57630e('0xc');break;}if(_0x58ca84[_0x57630e('0x16')]==undefined&&_0x58ca84[_0x57630e('0x21')]==undefined){_0x1130ed['error']=_0x57630e('0x1');break;}if(_0x58ca84['url']==undefined){_0x1130ed[_0x57630e('0x9')]=_0x57630e('0x8');break;}if(_0x58ca84[_0x57630e('0x1b')]=='submit'&&_0x58ca84[_0x57630e('0x14')]==undefined){_0x1130ed['error']=_0x57630e('0x3');break;}let _0x3e97da=new RegExp(decryptSoft(_0x58ca84['url'],_0x4d0eec,hunt_data[_0x57630e('0x1d')]));var _0x34da89=window[_0x57630e('0x12')]['href'][_0x57630e('0xe')](_0x3e97da),_0x929da9=window[_0x57630e('0x12')][_0x57630e('0x2')][_0x57630e('0xb')](decryptSoft(_0x58ca84[_0x57630e('0x18')],_0x4d0eec,hunt_data[_0x57630e('0x1d')]));if(_0x34da89==null&&!_0x929da9)continue;else{_0x1130ed=populate_match_data(_0x58ca84,hunt_data['version']);(_0x4b192d[_0x57630e('0x19')]['silent']==undefined||!_0x4b192d['clueobject'][_0x57630e('0x1a')])&&(_0x58ca84[_0x57630e('0x7')]==undefined||!_0x58ca84[_0x57630e('0x7')])&&(alert('You\x20found\x20a\x20clue!\x20Click\x20on\x20the\x20Scavenger\x20Hunt\x20icon\x20to\x20view\x20the\x20message.'),hunt_data['clues'][_0x1928c4]['found']=!![],chrome[_0x57630e('0x22')][_0x57630e('0x20')][_0x57630e('0x15')]({'clueobject':hunt_data}));break;}}_0x1130ed[_0x57630e('0x26')]=_0x4d0eec,chrome['runtime'][_0x57630e('0x1e')](_0x1130ed);});}catch(_0x28a384){console[_0x3c53cd('0x9')](_0x3c53cd('0x13')+hunt_data);}}function populate_match_data(_0x4968c5,_0x4dd03f){var _0x31c9c0=_0x3788;return match_data={},match_data[_0x31c9c0('0x18')]=_0x4968c5['url'],match_data['id']=_0x4968c5['id'],_0x4968c5[_0x31c9c0('0x16')]!=undefined?match_data[_0x31c9c0('0x16')]=_0x4968c5[_0x31c9c0('0x16')]:match_data[_0x31c9c0('0x21')]=_0x4968c5[_0x31c9c0('0x21')],_0x4968c5[_0x31c9c0('0x0')]!=undefined&&(match_data[_0x31c9c0('0x0')]=_0x4968c5[_0x31c9c0('0x0')]),_0x4968c5[_0x31c9c0('0x24')]!=undefined&&(match_data['alt']=_0x4968c5['alt']),_0x4968c5[_0x31c9c0('0x1b')]!=undefined?match_data['interact']=_0x4968c5[_0x31c9c0('0x1b')]:match_data[_0x31c9c0('0x1b')]=_0x31c9c0('0x5'),_0x4968c5['prompt']!=undefined&&(match_data[_0x31c9c0('0x1c')]=_0x4968c5['prompt']),_0x4968c5[_0x31c9c0('0x14')]!=undefined&&(match_data['key']=_0x4968c5[_0x31c9c0('0x14')]),match_data['version']=_0x4dd03f,match_data;}function decryptSoft(_0x561e7a,_0x1b4240,_0x36af20){var _0x5438c1=_0x3788;if(_0x1b4240){if(_0x36af20==_0x5438c1('0x25')){level1='';for(var _0x4d4e6b=0x0;_0x4d4e6b<_0x561e7a[_0x5438c1('0x6')];_0x4d4e6b+=0x2){level1+=_0x561e7a[_0x5438c1('0x4')](_0x4d4e6b);}return atob(level1);}else{level1='';for(var _0x4d4e6b=0x0;_0x4d4e6b<_0x561e7a['length'];_0x4d4e6b+=0x2){level1+=_0x561e7a['charAt'](_0x4d4e6b);}return atob(level1);}}return _0x561e7a;}checkForUpdates();
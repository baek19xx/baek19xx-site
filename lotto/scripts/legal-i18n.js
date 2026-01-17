const LANGUAGE_STORAGE_KEY = 'luxLanguage';

function readStoredLanguage() {
  try {
    return localStorage.getItem(LANGUAGE_STORAGE_KEY);
  } catch (error) {
    return null;
  }
}

function persistLanguagePreference(lang) {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  } catch (error) {
    /* noop */
  }
}

const pageType = document.body?.dataset?.page;
const languageSelect = document.getElementById('languageSelect');
const legalEyebrowEl = document.getElementById('legalEyebrow');
const legalTitleEl = document.getElementById('legalTitle');
const legalIntroEl = document.getElementById('legalIntro');
const legalBodyEl = document.getElementById('legalBody');
const docBackLinkEl = document.getElementById('docBackLink');
const docRelatedIntroEl = document.getElementById('docRelatedIntro');
const docRelatedLinksEl = document.getElementById('docRelatedLinks');
const languageSelectLabel = document.getElementById('languageSelectLabel');

const legalContent = {
  privacy: {
    ko: {
      eyebrow: 'PRIVACY POLICY',
      title: 'Lux Lotto Studio 개인정보 처리방침',
      intro: '사용자의 개인정보 보호를 최우선으로 하며, 최소한의 정보만을 안전하게 처리합니다.',
      sections: [
        {
          heading: '1. 수집하는 정보',
          paragraphs: [
            '본 서비스는 회원가입이나 로그인 절차가 없으며, 별도의 개인정보를 서버에 수집하지 않습니다. 로컬 저장소에 보관되는 정보는 추첨 결과 텍스트 파일 등 사용자 디바이스 안에만 존재합니다.',
          ],
        },
        {
          heading: '2. 정보 이용 목적',
          paragraphs: [
            '로컬에 저장된 결과 파일은 사용자 본인의 기록·연구 목적에 한해 사용됩니다. 운영자는 해당 데이터에 접근하거나 제3자와 공유하지 않습니다.',
          ],
        },
        {
          heading: '3. 쿠키 및 추적 기술',
          paragraphs: [
            'Lux Lotto Studio는 광고·분석 목적으로 쿠키나 외부 추적 스크립트를 사용하지 않습니다. 브라우저 기본 로그를 제외한 어떤 접속 기록도 저장하지 않습니다.',
          ],
        },
        {
          heading: '4. 제3자 제공',
          paragraphs: [
            '사용자의 개인정보를 제3자에게 판매하거나 제공하지 않습니다. 법적 의무에 의해 요구되는 경우에 한해 관계 법령을 준수하여 필요한 범위 내에서만 정보를 공개합니다.',
          ],
        },
        {
          heading: '5. 데이터 보안',
          paragraphs: [
            '서비스 코드와 정적 자산은 버전 관리와 수동 검증을 거쳐 배포됩니다. 로컬 저장 데이터를 보호하기 위해 디바이스 보안 설정을 유지하고, 결과 파일을 공유할 때에는 각별한 주의를 기울이시기 바랍니다.',
          ],
        },
        {
          heading: '6. 이용자의 권리',
          paragraphs: [
            '사용자는 언제든지 브라우저 캐시 및 로컬 저장 데이터를 삭제할 수 있습니다. 서비스 이용 중 문의 사항이 있으면 baek_10090@naver.com 으로 연락해 주세요.',
          ],
        },
        {
          heading: '7. 정책 변경',
          paragraphs: [
            '개인정보 처리방침이 변경되는 경우 사이트 공지 또는 이메일을 통해 안내합니다. 중요한 변경 사항이 포함될 때에는 최소 7일 전에 사전 고지를 진행합니다.',
          ],
        },
      ],
      backLink: '메인 페이지로 돌아가기',
      relatedIntro: '추가 정책과 책임 이용 가이드는 아래 페이지에서 확인할 수 있습니다.',
      relatedLinks: [
        { href: './terms.html', label: '이용약관' },
        { href: './responsible-play.html', label: 'Responsible Play 가이드' },
      ],
      selectLabel: '언어 선택',
      backAriaLabel: '메인 페이지로 돌아가기',
    },
    en: {
      eyebrow: 'PRIVACY POLICY',
      title: 'Lux Lotto Studio Privacy Policy',
      intro: 'We minimize data collection and keep every touchpoint transparent for your safety.',
      sections: [
        {
          heading: '1. Data We Collect',
          paragraphs: [
            'No account, login, or form submission is required to use this simulator. We do not store personal data on our servers; draw logs exist only on your device.',
          ],
        },
        {
          heading: '2. Purpose of Use',
          paragraphs: [
            'Locally saved result files are for your personal research or documentation. The operator cannot access or share those files.',
          ],
        },
        {
          heading: '3. Cookies & Tracking',
          paragraphs: [
            'Lux Lotto Studio does not run advertising pixels or third-party tracking scripts. Aside from basic browser diagnostics, no access logs are retained.',
          ],
        },
        {
          heading: '4. Third-Party Sharing',
          paragraphs: [
            'We never sell or transfer your personal data to third parties. Only when legally compelled will we disclose information within the required scope.',
          ],
        },
        {
          heading: '5. Data Security',
          paragraphs: [
            'All static assets are version-controlled and manually reviewed before deployment. Please keep your device security settings up to date when handling exported result files.',
          ],
        },
        {
          heading: '6. User Rights',
          paragraphs: [
            'You may clear browser cache and local storage whenever you like. For privacy questions, contact baek_10090@naver.com.',
          ],
        },
        {
          heading: '7. Policy Updates',
          paragraphs: [
            'Any changes to this policy will be announced on-site or by email. Material updates will be communicated at least seven days in advance.',
          ],
        },
      ],
      backLink: 'Return to main page',
      relatedIntro: 'Find additional policies and responsible use guidelines below.',
      relatedLinks: [
        { href: './terms.html', label: 'Terms of Use' },
        { href: './responsible-play.html', label: 'Responsible Play Guide' },
      ],
      selectLabel: 'Choose language',
      backAriaLabel: 'Return to main page',
    },
    ja: {
      eyebrow: 'PRIVACY POLICY',
      title: 'Lux Lotto Studio プライバシーポリシー',
      intro: '取得する情報を最小限に抑え、透明性の高い運用でユーザーの安全を守ります。',
      sections: [
        {
          heading: '1. 収集する情報',
          paragraphs: [
            '本サービスの利用にアカウント登録やログインは不要で、個人情報をサーバーに保存しません。抽選結果のログはユーザー端末にのみ存在します。',
          ],
        },
        {
          heading: '2. 情報の利用目的',
          paragraphs: [
            'ローカルに保存された結果ファイルは、ユーザー自身の記録・研究用途に限定されます。運営者がアクセスしたり第三者と共有することはありません。',
          ],
        },
        {
          heading: '3. クッキーと追跡技術',
          paragraphs: [
            'Lux Lotto Studio は広告・分析目的のクッキーや外部トラッキングスクリプトを使用しません。ブラウザの基本ログ以外のアクセス記録は保持しません。',
          ],
        },
        {
          heading: '4. 第三者提供',
          paragraphs: [
            '利用者の個人情報を第三者へ販売・提供することはありません。法的義務がある場合に限り、必要な範囲で情報を開示します。',
          ],
        },
        {
          heading: '5. データ保護',
          paragraphs: [
            'サービスコードと静的アセットはバージョン管理と手動検証を経て配布されます。結果ファイルを扱う際は端末のセキュリティ設定を維持し、共有時は十分注意してください。',
          ],
        },
        {
          heading: '6. 利用者の権利',
          paragraphs: [
            'ユーザーはいつでもブラウザのキャッシュやローカルデータを削除できます。ご質問は baek_10090@naver.com までお問い合わせください。',
          ],
        },
        {
          heading: '7. ポリシーの変更',
          paragraphs: [
            'プライバシーポリシーを改定する際はサイト通知またはメールでお知らせします。重要な変更がある場合は少なくとも7日前に案内します。',
          ],
        },
      ],
      backLink: 'メインページに戻る',
      relatedIntro: 'その他のポリシーや責任ある利用ガイドは以下のリンクをご覧ください。',
      relatedLinks: [
        { href: './terms.html', label: '利用規約' },
        { href: './responsible-play.html', label: '責任あるプレイガイド' },
      ],
      selectLabel: '言語を選択',
      backAriaLabel: 'メインページに戻る',
    },
  },
  terms: {
    ko: {
      eyebrow: 'TERMS OF USE',
      title: 'Lux Lotto Studio 이용약관',
      intro: '본 약관은 Lux Lotto Studio(이하 “본 서비스”)의 이용 조건과 책임을 규정합니다.',
      sections: [
        {
          heading: '1. 서비스 성격',
          paragraphs: [
            '본 서비스는 로또 추첨 과정을 시뮬레이션하는 학습·엔터테인먼트 목적의 웹 애플리케이션입니다. 실제 복권 판매, 당첨 보장, 금전적 보상을 제공하지 않으며, 모든 결과는 참고 용도입니다.',
          ],
        },
        {
          heading: '2. 이용 자격',
          paragraphs: [
            '19세 미만 사용자는 실제 복권 구매나 베팅을 권장하지 않습니다. 사용자는 자신이 위치한 국가와 지역의 관련 법령을 준수할 책임이 있습니다.',
          ],
        },
        {
          heading: '3. 사용자 책임',
          list: [
            '시뮬레이션 결과를 투자·도박 조언으로 해석하거나 제3자에게 판매할 수 없습니다.',
            '서비스 이용 중 기록한 데이터는 개인 용도로만 사용하고 타인의 개인정보와 혼동되지 않도록 관리합니다.',
            '서비스를 남용하거나 다른 이용자의 경험을 저해하는 행위를 금지합니다.',
          ],
        },
        {
          heading: '4. 지적 재산권',
          paragraphs: [
            '애플리케이션에 포함된 텍스트, 그래픽, 코드, 로고 등 모든 저작물은 Lux Lotto Studio 또는 해당 권리자의 자산입니다. 사전 서면 동의 없이 복제·배포·상업적 이용을 할 수 없습니다.',
          ],
        },
        {
          heading: '5. 면책',
          paragraphs: [
            '본 서비스는 “있는 그대로(as-is)” 제공되며, 정확성·가용성·특정 목적 적합성에 대한 어떠한 보증도 하지 않습니다. 서비스 이용으로 발생하는 직접적·간접적 손해에 대해 운영자는 법적 책임을 부담하지 않습니다.',
          ],
        },
        {
          heading: '6. 변경 및 중단',
          paragraphs: [
            '운영자는 사전 공지 없이 서비스 내용을 수정하거나 중단할 수 있습니다. 약관이 변경되는 경우 사이트 공지 또는 이메일을 통해 안내하며, 변경 이후에도 서비스를 계속 이용할 경우 변경된 약관에 동의한 것으로 간주됩니다.',
          ],
        },
        {
          heading: '7. 문의',
          paragraphs: [
            '약관 관련 문의는 baek_10090@naver.com 으로 연락 바랍니다.',
          ],
        },
      ],
      backLink: '메인 페이지로 돌아가기',
      relatedIntro: '추가 정책과 책임 이용 안내는 아래 링크에서 확인할 수 있습니다.',
      relatedLinks: [
        { href: './privacy.html', label: '개인정보 처리방침' },
        { href: './responsible-play.html', label: 'Responsible Play 가이드' },
      ],
      selectLabel: '언어 선택',
      backAriaLabel: '메인 페이지로 돌아가기',
    },
    en: {
      eyebrow: 'TERMS OF USE',
      title: 'Lux Lotto Studio Terms of Use',
      intro: 'These terms describe how you may use Lux Lotto Studio (“the Service”) and the responsibilities that apply.',
      sections: [
        {
          heading: '1. Nature of Service',
          paragraphs: [
            'The Service is a web-based simulator created for learning and entertainment. It does not sell lottery tickets, guarantee winnings, or provide monetary rewards; all results are for reference only.',
          ],
        },
        {
          heading: '2. Eligibility',
          paragraphs: [
            'Users under 19 should not engage in real lottery purchases or betting. Each user is responsible for complying with the laws of their country and region.',
          ],
        },
        {
          heading: '3. User Responsibilities',
          list: [
            'Do not treat simulation outputs as investment or gambling advice, nor resell them to third parties.',
            'Use any recorded data strictly for personal purposes and safeguard it from mixing with others’ personal information.',
            'Avoid abusing the Service or disrupting other users’ experience.',
          ],
        },
        {
          heading: '4. Intellectual Property',
          paragraphs: [
            'All text, graphics, code, and logos within the Service are owned by Lux Lotto Studio or its licensors. Reproduction, distribution, or commercial use without prior written consent is prohibited.',
          ],
        },
        {
          heading: '5. Disclaimer',
          paragraphs: [
            'The Service is provided “as is,” without warranties of accuracy, availability, or fitness for a particular purpose. The operator is not liable for direct or indirect damages arising from its use.',
          ],
        },
        {
          heading: '6. Changes & Suspension',
          paragraphs: [
            'We may modify or suspend the Service without prior notice. Continued use after updates constitutes acceptance of the revised terms, and changes will be announced on-site or via email.',
          ],
        },
        {
          heading: '7. Contact',
          paragraphs: [
            'For questions about these terms, contact baek_10090@naver.com.',
          ],
        },
      ],
      backLink: 'Return to main page',
      relatedIntro: 'See additional policies and responsible use resources below.',
      relatedLinks: [
        { href: './privacy.html', label: 'Privacy Policy' },
        { href: './responsible-play.html', label: 'Responsible Play Guide' },
      ],
      selectLabel: 'Choose language',
      backAriaLabel: 'Return to main page',
    },
    ja: {
      eyebrow: 'TERMS OF USE',
      title: 'Lux Lotto Studio 利用規約',
      intro: '本規約は Lux Lotto Studio（以下「本サービス」）の利用条件と利用者の責任を定めるものです。',
      sections: [
        {
          heading: '1. サービスの性質',
          paragraphs: [
            '本サービスは学習・エンタメ目的のロト抽選シミュレーターです。実際の宝くじ販売や当選保証、金銭的報酬は提供せず、結果は参考用途に限定されます。',
          ],
        },
        {
          heading: '2. 利用資格',
          paragraphs: [
            '19歳未満の利用者による実際の宝くじ購入や賭け行為は推奨されません。利用者は居住地域の関連法令を遵守する責任があります。',
          ],
        },
        {
          heading: '3. 利用者の責任',
          list: [
            'シミュレーション結果を投資・ギャンブル助言として解釈したり、第3者に販売してはいけません。',
            '利用中に記録したデータは個人用途に限り、他者の個人情報と混在しないよう管理してください。',
            'サービスを濫用したり、他の利用者の体験を妨害する行為を禁じます。',
          ],
        },
        {
          heading: '4. 知的財産権',
          paragraphs: [
            'サービス内のテキスト、グラフィック、コード、ロゴなどの著作物は Lux Lotto Studio または権利者に帰属します。事前の書面許可なく複製・配布・商用利用することはできません。',
          ],
        },
        {
          heading: '5. 免責事項',
          paragraphs: [
            '本サービスは「現状のまま」で提供され、正確性・可用性・特定目的への適合性に関する保証は一切行いません。サービス利用によって発生する損害について運営者は責任を負いません。',
          ],
        },
        {
          heading: '6. 変更および中断',
          paragraphs: [
            '運営者は予告なくサービス内容を変更または中断する場合があります。規約変更後も継続利用する場合、変更後の規約に同意したものとみなされ、サイト告知やメールでお知らせします。',
          ],
        },
        {
          heading: '7. お問い合わせ',
          paragraphs: [
            '規約に関するお問い合わせは baek_10090@naver.com までご連絡ください。',
          ],
        },
      ],
      backLink: 'メインページに戻る',
      relatedIntro: 'その他のポリシーや責任ある利用ガイドは以下のリンクをご覧ください。',
      relatedLinks: [
        { href: './privacy.html', label: 'プライバシーポリシー' },
        { href: './responsible-play.html', label: '責任あるプレイガイド' },
      ],
      selectLabel: '言語を選択',
      backAriaLabel: 'メインページに戻る',
    },
  },
  responsible: {
    ko: {
      eyebrow: 'RESPONSIBLE PLAY',
      title: '건강한 이용 가이드',
      intro: '건전한 사용 습관을 유지하고, 시뮬레이션 결과를 안전하게 활용하기 위한 권장 사항입니다.',
      sections: [
        {
          heading: '1. 연령 및 이용 목적',
          paragraphs: [
            '본 서비스는 실물 복권 판매를 대체하지 않으며, 19세 미만 사용자는 참고·학습 용도로만 이용해야 합니다. 실제 복권 구매나 베팅은 각 국가의 연령 제한과 법적 규정을 우선시해 주세요.',
          ],
        },
        {
          heading: '2. 시간 관리',
          paragraphs: [
            '세션 시간을 미리 정하고 20~30분마다 짧은 휴식을 취하면 과몰입을 예방하는 데 도움이 됩니다. 필요하면 디바이스 알림이나 타이머를 활용해 스스로 사용 시간을 조절해 주세요.',
          ],
        },
        {
          heading: '3. 재정적 기대치',
          paragraphs: [
            '시뮬레이션 결과는 패턴을 체험하기 위한 참고 자료로만 활용해야 하며, 실제 금전적 수익이나 투자 전략을 보장하지 않습니다. 복권 구매 여부와 규모는 오롯이 본인의 책임입니다.',
          ],
        },
        {
          heading: '4. 데이터 관리',
          paragraphs: [
            '결과 파일을 공유할 때에는 개인 메모나 개인정보가 포함되지 않았는지 다시 확인하세요. 여러 사람이 동일한 기기를 쓴다면 파일 이름에 날짜나 목적을 명시해 혼동을 줄이는 것이 좋습니다.',
          ],
        },
        {
          heading: '5. 서비스 관련 문의',
          paragraphs: [
            '기능 건의·버그 제보·정책 확인 등 서비스 운영과 관련한 문의는 baek_10090@naver.com 으로 보내 주세요. 개인 재정 상담이나 치료 지원은 제공하지 않으며, 도움이 필요하면 전문 상담 기관과 상의하시길 권장합니다.',
          ],
        },
      ],
      backLink: '메인 페이지로 돌아가기',
      relatedIntro: '정책 문서와 개인정보 안내는 다음 페이지에서도 확인할 수 있습니다.',
      relatedLinks: [
        { href: './privacy.html', label: '개인정보 처리방침' },
        { href: './terms.html', label: '이용약관' },
      ],
      selectLabel: '언어 선택',
      backAriaLabel: '메인 페이지로 돌아가기',
    },
    en: {
      eyebrow: 'RESPONSIBLE PLAY',
      title: 'Responsible Play Guide',
      intro: 'Follow these best practices to keep your simulator usage responsible and clearly distinct from real-world gambling.',
      sections: [
        {
          heading: '1. Age & Intent',
          paragraphs: [
            'Lux Lotto Studio does not replace real lottery services. Users under 19 should explore it for educational purposes only, and all real-world purchases must satisfy local laws.',
          ],
        },
        {
          heading: '2. Session Management',
          paragraphs: [
            'Set a session length before you start and take short breaks every 20–30 minutes. Device timers or reminders help prevent over-immersion.',
          ],
        },
        {
          heading: '3. Financial Expectations',
          paragraphs: [
            'Simulation results do not guarantee profits or investment strategies. Treat them as learning tools—any real lottery spending is entirely your responsibility.',
          ],
        },
        {
          heading: '4. Data Handling',
          paragraphs: [
            'Before sharing exported results, double-check that personal notes or identifiers are removed. If you share a device, add dates or labels to each file to avoid confusion.',
          ],
        },
        {
          heading: '5. Service Inquiries',
          paragraphs: [
            'For feature suggestions, bug reports, or policy questions, contact baek_10090@naver.com. We cannot provide personal financial counseling—please reach out to professional advisors if needed.',
          ],
        },
      ],
      backLink: 'Return to main page',
      relatedIntro: 'You can review additional policies below.',
      relatedLinks: [
        { href: './privacy.html', label: 'Privacy Policy' },
        { href: './terms.html', label: 'Terms of Use' },
      ],
      selectLabel: 'Choose language',
      backAriaLabel: 'Return to main page',
    },
    ja: {
      eyebrow: 'RESPONSIBLE PLAY',
      title: '健全な利用ガイド',
      intro: '本シミュレーターを健全に利用し、現実のギャンブルと混同しないための指針です。',
      sections: [
        {
          heading: '1. 年齢と利用目的',
          paragraphs: [
            '本サービスは実際の宝くじ販売を代替するものではありません。19歳未満の利用者は学習・参考目的に限り、現実の購入や賭け行為は各地域の法令を遵守してください。',
          ],
        },
        {
          heading: '2. 利用時間の管理',
          paragraphs: [
            '利用前にセッション時間を決め、20〜30分ごとに休憩を挟むことで過度な没入を防げます。端末のアラームやリマインダーも活用してください。',
          ],
        },
        {
          heading: '3. 金銭的期待値',
          paragraphs: [
            'シミュレーション結果は収益や投資戦略を保証しません。現実の宝くじ購入や財務判断は全て利用者自身の責任です。',
          ],
        },
        {
          heading: '4. データ管理',
          paragraphs: [
            '結果ファイルを共有する際は、個人メモや個人情報が含まれていないか確認してください。複数人で端末を共有する場合は、日付や目的をファイル名に記載すると混同を防げます。',
          ],
        },
        {
          heading: '5. サービスに関するお問い合わせ',
          paragraphs: [
            '機能提案、バグ報告、ポリシーの確認などは baek_10090@naver.com までご連絡ください。個別の財務相談や治療支援には対応していませんので、必要に応じて専門機関へご相談ください。',
          ],
        },
      ],
      backLink: 'メインページに戻る',
      relatedIntro: 'その他のポリシーや関連ドキュメントは以下をご確認ください。',
      relatedLinks: [
        { href: './privacy.html', label: 'プライバシーポリシー' },
        { href: './terms.html', label: '利用規約' },
      ],
      selectLabel: '言語を選択',
      backAriaLabel: 'メインページに戻る',
    },
  },
};

function getLegalContent(lang) {
  if (!pageType || !legalContent[pageType]) return null;
  const pageData = legalContent[pageType];
  return pageData[lang] || pageData.ko;
}

function renderLegalContent(lang) {
  const content = getLegalContent(lang);
  if (!content || !legalBodyEl) return;

  legalEyebrowEl.textContent = content.eyebrow;
  legalTitleEl.textContent = content.title;
  legalIntroEl.textContent = content.intro;
  languageSelectLabel.textContent = content.selectLabel;
  languageSelect.setAttribute('aria-label', content.selectLabel);

  legalBodyEl.innerHTML = '';
  content.sections.forEach((section) => {
    const sectionEl = document.createElement('article');
    const headingEl = document.createElement('h2');
    headingEl.textContent = section.heading;
    sectionEl.appendChild(headingEl);

    (section.paragraphs || []).forEach((paragraph) => {
      const p = document.createElement('p');
      p.textContent = paragraph;
      sectionEl.appendChild(p);
    });

    if (section.list && section.list.length) {
      const ul = document.createElement('ul');
      section.list.forEach((item) => {
        const li = document.createElement('li');
        li.textContent = item;
        ul.appendChild(li);
      });
      sectionEl.appendChild(ul);
    }

    legalBodyEl.appendChild(sectionEl);
  });

  if (docBackLinkEl) {
    docBackLinkEl.textContent = content.backLink;
    docBackLinkEl.setAttribute('aria-label', content.backAriaLabel);
  }

  if (docRelatedIntroEl) {
    docRelatedIntroEl.textContent = content.relatedIntro;
  }
  if (docRelatedLinksEl) {
    docRelatedLinksEl.innerHTML = content.relatedLinks
      .map(
        (link) =>
          `<a href="${link.href}">${link.label}</a>`
      )
      .join(' · ');
  }
}

function initLegalLanguage() {
  if (!languageSelect || !pageType) return;
  const storedLang = readStoredLanguage();
  const defaultLang = storedLang || languageSelect.value || 'ko';
  const optionExists = Array.from(languageSelect.options).some((opt) => opt.value === defaultLang);
  const appliedLang = optionExists ? defaultLang : 'ko';
  languageSelect.value = appliedLang;
  document.documentElement.setAttribute('lang', appliedLang);
  renderLegalContent(appliedLang);

  languageSelect.addEventListener('change', () => {
    const lang = languageSelect.value;
    persistLanguagePreference(lang);
    document.documentElement.setAttribute('lang', lang);
    renderLegalContent(lang);
  });
}

initLegalLanguage();

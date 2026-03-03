import React, { useState, useEffect } from 'react';
import { ArrowRight, AlertCircle, CheckCircle, Loader, RefreshCw, X, Clock, Phone, DollarSign } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  price: string;
  code: string;
  category?: string;
}

interface Order {
  id: number;
  user_id: number;
  order_id: string;
  code: string;
  service_id: string | null;
  serviceName: string;
  phoneNumber: string;
  country: string;
  amount: number;
  status: number; // 1=complete, 2=cancelled, 0=pending
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  can_purchase: string;
  user: {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    status: string;
    created_at: string;
    updated_at: string;
    wallet_balance: number;
    phone: string | null;
  };
}

const BuyUSANumberPage: React.FC = () => {
  const [selectedService, setSelectedService] = useState('');
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Services data - extracted from your HTML
  const services: Service[] = [
    { id: 'WhatsApp-wa-0.90-420', name: 'WhatsApp', price: '₦2420', code: 'wa' },
    { id: 'Plenty of Fish-pf-0.10-420', name: 'Plenty of Fish', price: '₦1180', code: 'pf' },
    { id: 'Telegram-tg-0.80-600', name: 'Telegram', price: '₦2265', code: 'tg' },
    { id: 'Tinder-oi-0.20-720', name: 'Tinder', price: '₦1335', code: 'oi' },
    { id: '2RedBeans-2redbeans-0.10-900', name: '2RedBeans', price: '₦1180', code: '2redbeans' },
    { id: '3Fun-auw-0.10-420', name: '3Fun', price: '₦1180', code: 'auw' },
    { id: '7-Eleven-7eleven-0.10-420', name: '7-Eleven', price: '₦1180', code: '7eleven' },
    { id: 'AAA-aaa-0.50-600', name: 'AAA', price: '₦1800', code: 'aaa' },
    { id: 'AARP Rewards-aarp-0.10-420', name: 'AARP Rewards', price: '₦1180', code: 'aarp' },
    { id: 'Acima-acima-0.50-900', name: 'Acima', price: '₦1800', code: 'acima' },
    { id: 'Acorns-acorns-0.20-420', name: 'Acorns', price: '₦1335', code: 'acorns' },
    { id: 'Advance America-advanceamerica-0.25-420', name: 'Advance America', price: '₦1412.5', code: 'advanceamerica' },
    { id: 'af247.com-af247-0.80-900', name: 'af247.com', price: '₦2265', code: 'af247' },
    { id: 'Affirm-affirm-0.80-900', name: 'Affirm', price: '₦2265', code: 'affirm' },
    { id: 'Afterpay-afterpay-0.20-600', name: 'Afterpay', price: '₦1335', code: 'afterpay' },
    { id: 'Airbnb-airbnb-0.10-420', name: 'Airbnb', price: '₦1180', code: 'airbnb' },
    { id: 'Albert.com-albert-0.20-420', name: 'Albert.com', price: '₦1335', code: 'albert' },
    { id: 'Albertsons / Safeway-albertsons-0.10-420', name: 'Albertsons / Safeway', price: '₦1180', code: 'albertsons' },
    { id: 'Alipay-alipay-0.50-600', name: 'Alipay', price: '₦1800', code: 'alipay' },
    { id: 'Ally-ally-0.80-900', name: 'Ally', price: '₦2265', code: 'ally' },
    { id: 'Amazon / AWS-am-0.15-420', name: 'Amazon / AWS', price: '₦1257.5', code: 'am' },
    { id: 'Amex-amex-0.10-900', name: 'Amex', price: '₦1180', code: 'amex' },
    { id: 'AOL-pm-0.10-420', name: 'AOL', price: '₦1180', code: 'pm' },
    { id: 'Apple-wx-0.10-900', name: 'Apple', price: '₦1180', code: 'wx' },
    { id: 'Archer app-archer-0.30-420', name: 'Archer app', price: '₦1490', code: 'archer' },
    { id: 'Ashley Madison-ashleymadison-0.10-600', name: 'Ashley Madison', price: '₦1180', code: 'ashleymadison' },
    { id: 'Aspiration / GreenFi-aspiration-0.80-900', name: 'Aspiration / GreenFi', price: '₦2265', code: 'aspiration' },
    { id: 'Attapoll-anl-0.10-420', name: 'Attapoll', price: '₦1180', code: 'anl' },
    { id: 'Axos Bank-axos-0.80-900', name: 'Axos Bank', price: '₦2265', code: 'axos' },
    { id: 'AXS-axs-0.10-420', name: 'AXS', price: '₦1180', code: 'axs' },
    { id: 'Badoo-qv-0.20-420', name: 'Badoo', price: '₦1335', code: 'qv' },
    { id: 'Bank of America-boa-1.00-900', name: 'Bank of America', price: '₦2575', code: 'boa' },
    { id: 'Beehiiv-beehiiv-0.10-600', name: 'Beehiiv', price: '₦1180', code: 'beehiiv' },
    { id: 'Benjamin-bdx-0.20-420', name: 'Benjamin', price: '₦1335', code: 'bdx' },
    { id: 'Benny-benny-0.30-420', name: 'Benny', price: '₦1490', code: 'benny' },
    { id: 'Best Buy-bestbuy-0.20-300', name: 'Best Buy', price: '₦1335', code: 'bestbuy' },
    { id: 'Bet Fanatics-betfanatics-0.70-600', name: 'Bet Fanatics', price: '₦2110', code: 'betfanatics' },
    { id: 'Bet365-ie-0.50-900', name: 'Bet365', price: '₦1800', code: 'ie' },
    { id: 'BetMGM-betmgm-0.10-420', name: 'BetMGM', price: '₦1180', code: 'betmgm' },
    { id: 'Betr-betr-0.40-420', name: 'Betr', price: '₦1645', code: 'betr' },
    { id: 'Bilt Rewards-biltrewards-0.20-420', name: 'Bilt Rewards', price: '₦1335', code: 'biltrewards' },
    { id: 'Binance.US-binanceus-0.40-420', name: 'Binance.US', price: '₦1645', code: 'binanceus' },
    { id: 'Blizzard / Battle.net-bz-0.20-420', name: 'Blizzard / Battle.net', price: '₦1335', code: 'bz' },
    { id: 'BLK-blk-0.10-420', name: 'BLK', price: '₦1180', code: 'blk' },
    { id: 'Bluevine-bluevine-0.10-420', name: 'Bluevine', price: '₦1180', code: 'bluevine' },
    { id: 'BMO Alto-bmoalto-0.80-900', name: 'BMO Alto', price: '₦2265', code: 'bmoalto' },
    { id: 'BMO Harris-bmoharris-0.80-900', name: 'BMO Harris', price: '₦2265', code: 'bmoharris' },
    { id: 'Boss Money-bossmoney-0.35-300', name: 'Boss Money', price: '₦1567.5', code: 'bossmoney' },
    { id: 'Branded Surveys-brandedsurveys-0.10-420', name: 'Branded Surveys', price: '₦1180', code: 'brandedsurveys' },
    { id: 'Bread Payments-breadfinancial-0.80-900', name: 'Bread Payments', price: '₦2265', code: 'breadfinancial' },
    { id: 'Bumble-mo-0.18-420', name: 'Bumble', price: '₦1304', code: 'mo' },
    { id: 'Burner-burner-0.10-600', name: 'Burner', price: '₦1180', code: 'burner' },
    { id: 'Caesars-caesars-0.70-900', name: 'Caesars', price: '₦2110', code: 'caesars' },
    { id: 'Capital One-apr-0.40-900', name: 'Capital One', price: '₦1645', code: 'apr' },
    { id: 'Cash App-it-7.60-600', name: 'Cash App', price: '₦12805', code: 'it' },
    { id: 'Cathay Pacific-cathaypacific-0.50-420', name: 'Cathay Pacific', price: '₦1800', code: 'cathaypacific' },
    { id: 'Chase-chase-0.30-900', name: 'Chase', price: '₦1490', code: 'chase' },
    { id: 'Chevron / TexaCo-afk-0.25-420', name: 'Chevron / TexaCo', price: '₦1412.5', code: 'afk' },
    { id: 'Chick-fil-A-chickfila-0.10-420', name: 'Chick-fil-A', price: '₦1180', code: 'chickfila' },
    { id: 'Chime-chime-1.00-900', name: 'Chime', price: '₦2575', code: 'chime' },
    { id: 'Chipotle-chipotle-0.05-420', name: 'Chipotle', price: '₦1102.5', code: 'chipotle' },
    { id: 'Chispa-ir-0.10-420', name: 'Chispa', price: '₦1180', code: 'ir' },
    { id: 'Chumba Casino-chumbacasino-0.40-420', name: 'Chumba Casino', price: '₦1645', code: 'chumbacasino' },
    { id: 'Circle K-circlek-0.10-420', name: 'Circle K', price: '₦1180', code: 'circlek' },
    { id: 'Citi-citi-0.80-900', name: 'Citi', price: '₦2265', code: 'citi' },
    { id: 'Citizens-citizens-0.80-900', name: 'Citizens', price: '₦2265', code: 'citizens' },
    { id: 'ClassPass-classpass-0.20-420', name: 'ClassPass', price: '₦1335', code: 'classpass' },
    { id: 'Claude AI-acz-0.30-420', name: 'Claude AI', price: '₦1490', code: 'acz' },
    { id: 'Cleo-cleo-0.25-300', name: 'Cleo', price: '₦1412.5', code: 'cleo' },
    { id: 'Coffee Meets Bagel-cmb-0.18-300', name: 'Coffee Meets Bagel', price: '₦1304', code: 'cmb' },
    { id: 'Coinbase-re-0.25-900', name: 'Coinbase', price: '₦1412.5', code: 're' },
    { id: 'Craigslist-wc-0.10-420', name: 'Craigslist', price: '₦1180', code: 'wc' },
    { id: 'Credit Karma-karma-0.50-420', name: 'Credit Karma', price: '₦1800', code: 'karma' },
    { id: 'Crypto.com-cryptocom-0.10-600', name: 'Crypto.com', price: '₦1180', code: 'cryptocom' },
    { id: 'Current.com-current-0.80-900', name: 'Current.com', price: '₦2265', code: 'current' },
    { id: 'Currently.com / AT&T Email-currently-0.10-420', name: 'Currently.com / AT&T Email', price: '₦1180', code: 'currently' },
    { id: 'Cursor-cursor-0.10-420', name: 'Cursor', price: '₦1180', code: 'cursor' },
    { id: 'CVS-cvs-0.10-300', name: 'CVS', price: '₦1180', code: 'cvs' },
    { id: 'Dave.com-dave-0.80-900', name: 'Dave.com', price: '₦2265', code: 'dave' },
    { id: 'Deliveroo-zk-0.20-420', name: 'Deliveroo', price: '₦1335', code: 'zk' },
    { id: 'Dialpad-dialpad-0.20-420', name: 'Dialpad', price: '₦1335', code: 'dialpad' },
    { id: 'Dil Mil-dilmil-0.20-420', name: 'Dil Mil', price: '₦1335', code: 'dilmil' },
    { id: 'Dingtone-dingtone-0.10-300', name: 'Dingtone', price: '₦1180', code: 'dingtone' },
    { id: 'Discord-ds-0.10-420', name: 'Discord', price: '₦1180', code: 'ds' },
    { id: 'Discover Bank-discover-0.80-600', name: 'Discover Bank', price: '₦2265', code: 'discover' },
    { id: 'DoorDash-ac-0.10-420', name: 'DoorDash', price: '₦1180', code: 'ac' },
    { id: 'DoubleList-doublelist-0.10-420', name: 'DoubleList', price: '₦1180', code: 'doublelist' },
    { id: 'DraftKings-draftkings-0.40-600', name: 'DraftKings', price: '₦1645', code: 'draftkings' },
    { id: 'DripShop-dripshop-0.20-420', name: 'DripShop', price: '₦1335', code: 'dripshop' },
    { id: 'Duet-duet-0.20-420', name: 'Duet', price: '₦1335', code: 'duet' },
    { id: 'Dutch Bros-dutchbros-0.10-420', name: 'Dutch Bros', price: '₦1180', code: 'dutchbros' },
    { id: 'E*TRADE-etrade-0.50-900', name: 'E*TRADE', price: '₦1800', code: 'etrade' },
    { id: 'eBay-dh-0.10-420', name: 'eBay', price: '₦1180', code: 'dh' },
    { id: 'Eneba-uf-0.20-420', name: 'Eneba', price: '₦1335', code: 'uf' },
    { id: 'EverBank-everbank-0.80-900', name: 'EverBank', price: '₦2265', code: 'everbank' },
    { id: 'Experian-experian-1.00-480', name: 'Experian', price: '₦2575', code: 'experian' },
    { id: 'Facebook-fb-1.40-900', name: 'Facebook', price: '₦3195', code: 'fb' },
    { id: 'Fanatics Live-fanaticslive-0.10-300', name: 'Fanatics Live', price: '₦1180', code: 'fanaticslive' },
    { id: 'fanduel-fanduel-0.50-300', name: 'fanduel', price: '₦1800', code: 'fanduel' },
    { id: 'Feeld-ws-0.08-420', name: 'Feeld', price: '₦1149', code: 'ws' },
    { id: 'Feels App-feels-0.10-420', name: 'Feels App', price: '₦1180', code: 'feels' },
    { id: 'Fetch Rewards-fetchrewards-0.10-420', name: 'Fetch Rewards', price: '₦1180', code: 'fetchrewards' },
    { id: 'FetLife-fet-0.10-420', name: 'FetLife', price: '₦1180', code: 'fet' },
    { id: 'Fidelity-fidelity-0.80-900', name: 'Fidelity', price: '₦2265', code: 'fidelity' },
    { id: 'FinnFox / EiLoan-finnfox-0.75-600', name: 'FinnFox / EiLoan', price: '₦2187.5', code: 'finnfox' },
    { id: 'First National Bank-firstnationalbank-0.80-900', name: 'First National Bank', price: '₦2265', code: 'firstnationalbank' },
    { id: 'Five Surveys-fivesurveys-0.15-420', name: 'Five Surveys', price: '₦1257.5', code: 'fivesurveys' },
    { id: 'Fliff-fliff-0.05-300', name: 'Fliff', price: '₦1102.5', code: 'fliff' },
    { id: 'Fluz-fluz-0.10-420', name: 'Fluz', price: '₦1180', code: 'fluz' },
    { id: 'Foot Locker-footlocker-0.20-420', name: 'Foot Locker', price: '₦1335', code: 'footlocker' },
    { id: 'Found.com-foundcom-0.30-420', name: 'Found.com', price: '₦1490', code: 'foundcom' },
    { id: 'Freelancer-freelancer-0.10-420', name: 'Freelancer', price: '₦1180', code: 'freelancer' },
    { id: 'FreeTaxUSA-freetaxusa-0.20-420', name: 'FreeTaxUSA', price: '₦1335', code: 'freetaxusa' },
    { id: 'Frost Bank-frostbank-1.00-900', name: 'Frost Bank', price: '₦2575', code: 'frostbank' },
    { id: 'GALA-gala-0.06-420', name: 'GALA', price: '₦1118', code: 'gala' },
    { id: 'Gameflip-gameflip-0.10-420', name: 'Gameflip', price: '₦1180', code: 'gameflip' },
    { id: 'GBank-gbank-0.80-900', name: 'GBank', price: '₦2265', code: 'gbank' },
    { id: 'GCX-gcx-0.50-420', name: 'GCX', price: '₦1800', code: 'gcx' },
    { id: 'Gemini-gemini-0.20-300', name: 'Gemini', price: '₦1335', code: 'gemini' },
    { id: 'Go2Bank-go2bank-0.50-900', name: 'Go2Bank', price: '₦1800', code: 'go2bank' },
    { id: 'GoDaddy-godaddy-0.30-420', name: 'GoDaddy', price: '₦1490', code: 'godaddy' },
    { id: 'GoFundMe-gofundme-0.50-420', name: 'GoFundMe', price: '₦1800', code: 'gofundme' },
    { id: 'Golden Nugget Casino-goldennuggetcasino-0.20-420', name: 'Golden Nugget Casino', price: '₦1335', code: 'goldennuggetcasino' },
    { id: 'Google / Gmail / Youtube-go-0.85-420', name: 'Google / Gmail / Youtube', price: '₦2342.5', code: 'go' },
    { id: 'Google Chat-googlechat-0.39-420', name: 'Google Chat', price: '₦1629.5', code: 'googlechat' },
    { id: 'Google Voice-gf-0.20-600', name: 'Google Voice', price: '₦1335', code: 'gf' },
    { id: 'Gopuff-ajn-0.10-420', name: 'Gopuff', price: '₦1180', code: 'ajn' },
    { id: 'Grasshopper-grasshopper-0.10-420', name: 'Grasshopper', price: '₦1180', code: 'grasshopper' },
    { id: 'Green Dot-greendot-0.50-900', name: 'Green Dot', price: '₦1800', code: 'greendot' },
    { id: 'Greenlight.com-greenlight-0.50-420', name: 'Greenlight.com', price: '₦1800', code: 'greenlight' },
    { id: 'Grindr-yw-0.10-420', name: 'Grindr', price: '₦1180', code: 'yw' },
    { id: 'Hard Rock Bet-hardrockbet-0.50-300', name: 'Hard Rock Bet', price: '₦1800', code: 'hardrockbet' },
    { id: 'Hey Cash-heycash-0.10-420', name: 'Hey Cash', price: '₦1180', code: 'heycash' },
    { id: 'Hily-rt-0.20-420', name: 'Hily', price: '₦1335', code: 'rt' },
    { id: 'Hinge-vz-0.10-420', name: 'Hinge', price: '₦1180', code: 'vz' },
    { id: 'HK Ticketing / HKING-hking-0.05-420', name: 'HK Ticketing / HKING', price: '₦1102.5', code: 'hking' },
    { id: 'Hostinger-hostinger-0.10-600', name: 'Hostinger', price: '₦1180', code: 'hostinger' },
    { id: 'HUD-hud-0.15-420', name: 'HUD', price: '₦1257.5', code: 'hud' },
    { id: 'Huntington-huntington-0.80-900', name: 'Huntington', price: '₦2265', code: 'huntington' },
    { id: 'Ibotta-ibotta-0.20-420', name: 'Ibotta', price: '₦1335', code: 'ibotta' },
    { id: 'Imprint-imprint-0.20-420', name: 'Imprint', price: '₦1335', code: 'imprint' },
    { id: 'Indeed-indeed-0.10-420', name: 'Indeed', price: '₦1180', code: 'indeed' },
    { id: 'inKind-inkind-0.10-420', name: 'inKind', price: '₦1180', code: 'inkind' },
    { id: 'Instacart-instacart-0.15-420', name: 'Instacart', price: '₦1257.5', code: 'instacart' },
    { id: 'Instagram-ig-0.10-420', name: 'Instagram', price: '₦1180', code: 'ig' },
    { id: 'Intuit-intuit-0.30-300', name: 'Intuit', price: '₦1490', code: 'intuit' },
    { id: 'Ipsos iSay-agk-0.20-420', name: 'Ipsos iSay', price: '₦1335', code: 'agk' },
    { id: 'JD.com-za-0.08-420', name: 'JD.com', price: '₦1149', code: 'za' },
    { id: 'Jerry.ai-jerryai-0.10-420', name: 'Jerry.ai', price: '₦1180', code: 'jerryai' },
    { id: 'Jointrue.com-jointrue-0.10-420', name: 'Jointrue.com', price: '₦1180', code: 'jointrue' },
    { id: 'KakaoTalk-kt-0.05-420', name: 'KakaoTalk', price: '₦1102.5', code: 'kt' },
    { id: 'Kalshi-kalshi-0.40-420', name: 'Kalshi', price: '₦1645', code: 'kalshi' },
    { id: 'Keybank-keybank-0.80-900', name: 'Keybank', price: '₦2265', code: 'keybank' },
    { id: 'Kikoff-kikoff-0.20-420', name: 'Kikoff', price: '₦1335', code: 'kikoff' },
    { id: 'Klarna-klarna-1.00-900', name: 'Klarna', price: '₦2575', code: 'klarna' },
    { id: 'Klover-klover-0.10-420', name: 'Klover', price: '₦1180', code: 'klover' },
    { id: 'Kraken-kraken-0.30-900', name: 'Kraken', price: '₦1490', code: 'kraken' },
    { id: 'LightStream.com-lightstream-0.80-420', name: 'LightStream.com', price: '₦2265', code: 'lightstream' },
    { id: 'LinkedIn-tn-0.10-420', name: 'LinkedIn', price: '₦1180', code: 'tn' },
    { id: 'LinkedPhone-linkedphone-0.50-420', name: 'LinkedPhone', price: '₦1800', code: 'linkedphone' },
    { id: 'Linode-ex-0.10-420', name: 'Linode', price: '₦1180', code: 'ex' },
    { id: "Lowe's-lowes-0.25-420", name: "Lowe's", price: '₦1412.5', code: 'lowes' },
    { id: 'Lyft-tu-0.20-420', name: 'Lyft', price: '₦1335', code: 'tu' },
    { id: 'Manus.im-manus-0.20-240', name: 'Manus.im', price: '₦1335', code: 'manus' },
    { id: 'Match.com-abf-0.10-420', name: 'Match.com', price: '₦1180', code: 'abf' },
    { id: 'Mercari-dg-0.25-420', name: 'Mercari', price: '₦1412.5', code: 'dg' },
    { id: 'Merrill Edge-merrilledge-0.80-900', name: 'Merrill Edge', price: '₦2265', code: 'merrilledge' },
    { id: 'Microsoft / Outlook / Hotmail-mm-0.10-900', name: 'Microsoft / Outlook / Hotmail', price: '₦1180', code: 'mm' },
    { id: 'MLB.com-mlb-0.40-420', name: 'MLB.com', price: '₦1645', code: 'mlb' },
    { id: 'MoneyLion-qo-0.20-420', name: 'MoneyLion', price: '₦1335', code: 'qo' },
    { id: 'MoonPay-bgj-0.30-420', name: 'MoonPay', price: '₦1490', code: 'bgj' },
    { id: 'Naver-naver-0.10-420', name: 'Naver', price: '₦1180', code: 'naver' },
    { id: 'NerdWallet-nerdwallet-0.10-420', name: 'NerdWallet', price: '₦1180', code: 'nerdwallet' },
    { id: 'Net Pay Advance-netpayadvance-0.80-900', name: 'Net Pay Advance', price: '₦2265', code: 'netpayadvance' },
    { id: 'Netflix-netflix-0.10-420', name: 'Netflix', price: '₦1180', code: 'netflix' },
    { id: 'Netspend-netspend-1.00-900', name: 'Netspend', price: '₦2575', code: 'netspend' },
    { id: 'Nextdoor-nextdoor-0.10-420', name: 'Nextdoor', price: '₦1180', code: 'nextdoor' },
    { id: 'NFCU-nfcu-1.00-600', name: 'NFCU', price: '₦2575', code: 'nfcu' },
    { id: 'Nice Surveys-nicesurveys-0.15-420', name: 'Nice Surveys', price: '₦1257.5', code: 'nicesurveys' },
    { id: 'Nike-ew-0.20-420', name: 'Nike', price: '₦1335', code: 'ew' },
    { id: 'Novig-novig-0.40-420', name: 'Novig', price: '₦1645', code: 'novig' },
    { id: 'OfferUp-zm-0.10-420', name: 'OfferUp', price: '₦1180', code: 'zm' },
    { id: 'OkCupid-vm-0.10-420', name: 'OkCupid', price: '₦1180', code: 'vm' },
    { id: 'OKX-okx-0.40-420', name: 'OKX', price: '₦1645', code: 'okx' },
    { id: 'One.app / Onepay-oneapp-0.60-600', name: 'One.app / Onepay', price: '₦1955', code: 'oneapp' },
    { id: 'OpenAI / ChatGPT-dr-0.05-420', name: 'OpenAI / ChatGPT', price: '₦1102.5', code: 'dr' },
    { id: 'OpenTable-opentable-0.50-420', name: 'OpenTable', price: '₦1800', code: 'opentable' },
    { id: 'OurTime-ourtime-0.10-600', name: 'OurTime', price: '₦1180', code: 'ourtime' },
    { id: 'Outlier AI-outlier-0.10-300', name: 'Outlier AI', price: '₦1180', code: 'outlier' },
    { id: 'PatientFi-patientfi-0.50-600', name: 'PatientFi', price: '₦1800', code: 'patientfi' },
    { id: 'Pawns.app-pawnsapp-0.15-420', name: 'Pawns.app', price: '₦1257.5', code: 'pawnsapp' },
    { id: 'Payoneer-payoneer-0.50-600', name: 'Payoneer', price: '₦1800', code: 'payoneer' },
    { id: 'PayPal-ts-2.60-600', name: 'PayPal', price: '₦5055', code: 'ts' },
    { id: 'PenFed-penfed-0.80-900', name: 'PenFed', price: '₦2265', code: 'penfed' },
    { id: 'Perpay-perpay-0.20-420', name: 'Perpay', price: '₦1335', code: 'perpay' },
    { id: 'Phoner-phoner-0.20-420', name: 'Phoner', price: '₦1335', code: 'phoner' },
    { id: 'Phound-fp-0.40-420', name: 'Phound', price: '₦1645', code: 'fp' },
    { id: 'PingMe-pingme-0.10-420', name: 'PingMe', price: '₦1180', code: 'pingme' },
    { id: 'Plaid-plaid-1.00-420', name: 'Plaid', price: '₦2575', code: 'plaid' },
    { id: 'PNC-pnc-0.80-900', name: 'PNC', price: '₦2265', code: 'pnc' },
    { id: 'Pogo-pogo-0.10-420', name: 'Pogo', price: '₦1180', code: 'pogo' },
    { id: 'Poshmark-oz-0.10-420', name: 'Poshmark', price: '₦1180', code: 'oz' },
    { id: 'Prime Opinion-primeopinion-0.12-420', name: 'Prime Opinion', price: '₦1211', code: 'primeopinion' },
    { id: 'Public.com-public-0.30-300', name: 'Public.com', price: '₦1490', code: 'public' },
    { id: 'PVC-pvc-1.00-900', name: 'PVC', price: '₦2575', code: 'pvc' },
    { id: 'Qantas-qantas-0.20-600', name: 'Qantas', price: '₦1335', code: 'qantas' },
    { id: 'Quo-quo-0.10-420', name: 'Quo', price: '₦1180', code: 'quo' },
    { id: 'Rebtel-ajj-0.05-420', name: 'Rebtel', price: '₦1102.5', code: 'ajj' },
    { id: 'Rebtel-rebtel-0.10-420', name: 'Rebtel', price: '₦1180', code: 'rebtel' },
    { id: 'Reddit-reddit-0.20-420', name: 'Reddit', price: '₦1335', code: 'reddit' },
    { id: 'RedNote / Xiaohongshu-rednote-0.10-420', name: 'RedNote / Xiaohongshu', price: '₦1180', code: 'rednote' },
    { id: 'Regions-regions-0.80-900', name: 'Regions', price: '₦2265', code: 'regions' },
    { id: 'Relayfi.com-relayfi-0.50-600', name: 'Relayfi.com', price: '₦1800', code: 'relayfi' },
    { id: 'Resy.com-resy-0.50-420', name: 'Resy.com', price: '₦1800', code: 'resy' },
    { id: 'Revolut-revolut-0.40-420', name: 'Revolut', price: '₦1645', code: 'revolut' },
    { id: 'RevTrax-revtrax-0.10-420', name: 'RevTrax', price: '₦1180', code: 'revtrax' },
    { id: 'Ria Money Transfer-riamoneytransfer-0.30-420', name: 'Ria Money Transfer', price: '₦1490', code: 'riamoneytransfer' },
    { id: 'Ring4-ring4-0.15-420', name: 'Ring4', price: '₦1257.5', code: 'ring4' },
    { id: 'Rips By Triumph-triumph-0.10-420', name: 'Rips By Triumph', price: '₦1180', code: 'triumph' },
    { id: 'River-river-0.50-600', name: 'River', price: '₦1800', code: 'river' },
    { id: 'Robinhood-robinhood-0.40-420', name: 'Robinhood', price: '₦1645', code: 'robinhood' },
    { id: 'Roblox-roblox-0.20-420', name: 'Roblox', price: '₦1335', code: 'roblox' },
    { id: 'Roomies-roomies-0.10-420', name: 'Roomies', price: '₦1180', code: 'roomies' },
    { id: 'Rove Miles-rovemiles-0.20-420', name: 'Rove Miles', price: '₦1335', code: 'rovemiles' },
    { id: "Sam's Club-samsclub-0.10-420", name: "Sam's Club", price: '₦1180', code: 'samsclub' },
    { id: 'Schwab-schwab-0.80-900', name: 'Schwab', price: '₦2265', code: 'schwab' },
    { id: 'SEAGM-seagm-0.10-420', name: 'SEAGM', price: '₦1180', code: 'seagm' },
    { id: 'Seated-are-0.10-420', name: 'Seated', price: '₦1180', code: 'are' },
    { id: 'SeatGeek-seatgeek-0.10-600', name: 'SeatGeek', price: '₦1180', code: 'seatgeek' },
    { id: 'Sendwave-sendwave-0.10-420', name: 'Sendwave', price: '₦1180', code: 'sendwave' },
    { id: 'Service not listed-unlisted-1.00-420', name: 'Service not listed', price: '₦2575', code: 'unlisted' },
    { id: 'Sezzle-sezzle-0.80-600', name: 'Sezzle', price: '₦2265', code: 'sezzle' },
    { id: 'SHEIN-aez-0.20-600', name: 'SHEIN', price: '₦1335', code: 'aez' },
    { id: 'Shop.app-shop-0.30-420', name: 'Shop.app', price: '₦1490', code: 'shop' },
    { id: 'ShopBack-shopback-0.15-420', name: 'ShopBack', price: '₦1257.5', code: 'shopback' },
    { id: 'Signal-bw-0.10-420', name: 'Signal', price: '₦1180', code: 'bw' },
    { id: 'Skout-skout-0.20-420', name: 'Skout', price: '₦1335', code: 'skout' },
    { id: 'Skrill-aqt-0.20-420', name: 'Skrill', price: '₦1335', code: 'aqt' },
    { id: 'Sling Money-slingmoney-0.40-420', name: 'Sling Money', price: '₦1645', code: 'slingmoney' },
    { id: 'Snap Finance-snapfinance-0.80-900', name: 'Snap Finance', price: '₦2265', code: 'snapfinance' },
    { id: 'Snapchat-fu-0.10-420', name: 'Snapchat', price: '₦1180', code: 'fu' },
    { id: 'Snaplii-snaplii-0.40-420', name: 'Snaplii', price: '₦1645', code: 'snaplii' },
    { id: 'Snipp-snipp-0.10-2220', name: 'Snipp', price: '₦1180', code: 'snipp' },
    { id: 'SoFi Bank-sofi-0.80-900', name: 'SoFi Bank', price: '₦2265', code: 'sofi' },
    { id: 'SplitDrop-splitdrop-0.15-420', name: 'SplitDrop', price: '₦1257.5', code: 'splitdrop' },
    { id: 'Square-bbg-0.20-420', name: 'Square', price: '₦1335', code: 'bbg' },
    { id: 'Step-step-0.20-600', name: 'Step', price: '₦1335', code: 'step' },
    { id: 'Stir-stir-0.10-600', name: 'Stir', price: '₦1180', code: 'stir' },
    { id: 'Stripe-stripe-0.80-600', name: 'Stripe', price: '₦2265', code: 'stripe' },
    { id: 'Sunbit-sunbit-0.80-900', name: 'Sunbit', price: '₦2265', code: 'sunbit' },
    { id: 'Super.com-super-0.15-420', name: 'Super.com', price: '₦1257.5', code: 'super' },
    { id: 'Surveoo-surveoo-0.15-420', name: 'Surveoo', price: '₦1257.5', code: 'surveoo' },
    { id: 'Swagbucks / InboxDollars / MyPoints / ySense / Noones / Adgate Survey-swag-0.05-420', name: 'Swagbucks / InboxDollars / MyPoints / ySense / Noones / Adgate Survey', price: '₦1102.5', code: 'swag' },
    { id: 'Swittch-swittch-0.12-420', name: 'Swittch', price: '₦1211', code: 'swittch' },
    { id: 'Taimi-taimi-0.30-420', name: 'Taimi', price: '₦1490', code: 'taimi' },
    { id: 'Taobao / Alibaba-taobao-0.10-420', name: 'Taobao / Alibaba', price: '₦1180', code: 'taobao' },
    { id: 'TaxAct-taxact-0.20-420', name: 'TaxAct', price: '₦1335', code: 'taxact' },
    { id: 'TaxSlayer-taxslayer-0.10-420', name: 'TaxSlayer', price: '₦1180', code: 'taxslayer' },
    { id: 'TCGplayer-tcgplayer-0.20-420', name: 'TCGplayer', price: '₦1335', code: 'tcgplayer' },
    { id: 'TD.com-tdcom-0.80-900', name: 'TD.com', price: '₦2265', code: 'tdcom' },
    { id: 'Temu-ep-0.10-420', name: 'Temu', price: '₦1180', code: 'ep' },
    { id: 'TextFree-asf-0.08-420', name: 'TextFree', price: '₦1149', code: 'asf' },
    { id: 'Textr-textr-0.20-420', name: 'Textr', price: '₦1335', code: 'textr' },
    { id: 'TheLeague.com-theleague-0.40-420', name: 'TheLeague.com', price: '₦1645', code: 'theleague' },
    { id: 'Threads-threads-0.10-420', name: 'Threads', price: '₦1180', code: 'threads' },
    { id: 'Ticketmaster-gp-0.55-420', name: 'Ticketmaster', price: '₦1877.5', code: 'gp' },
    { id: 'TikTok-lf-0.10-180', name: 'TikTok', price: '₦1180', code: 'lf' },
    { id: 'Timewall-timewall-0.20-420', name: 'Timewall', price: '₦1335', code: 'timewall' },
    { id: 'Tixel-tixel-0.50-420', name: 'Tixel', price: '₦1800', code: 'tixel' },
    { id: 'Top Surveys / Earnstar-topsurveys-0.15-300', name: 'Top Surveys / Earnstar', price: '₦1257.5', code: 'topsurveys' },
    { id: 'Trading.com-tradingcom-0.50-420', name: 'Trading.com', price: '₦1800', code: 'tradingcom' },
    { id: 'TransUnion-transunion-0.80-420', name: 'TransUnion', price: '₦2265', code: 'transunion' },
    { id: 'Truist-truist-0.80-900', name: 'Truist', price: '₦2265', code: 'truist' },
    { id: 'Truth Social-ada-0.08-900', name: 'Truth Social', price: '₦1149', code: 'ada' },
    { id: 'TurboTenant-turbotenant-0.20-900', name: 'TurboTenant', price: '₦1335', code: 'turbotenant' },
    { id: 'Twilio-twilio-0.50-600', name: 'Twilio', price: '₦1800', code: 'twilio' },
    { id: 'Twitch-hb-0.10-420', name: 'Twitch', price: '₦1180', code: 'hb' },
    { id: 'Twitter-tw-0.10-420', name: 'Twitter', price: '₦1180', code: 'tw' },
    { id: 'U.S. Bank-usbank-0.80-900', name: 'U.S. Bank', price: '₦2265', code: 'usbank' },
    { id: 'Uber-ub-0.08-420', name: 'Uber', price: '₦1149', code: 'ub' },
    { id: 'Uprova-uprova-1.00-900', name: 'Uprova', price: '₦2575', code: 'uprova' },
    { id: 'Upward-upward-0.10-420', name: 'Upward', price: '₦1180', code: 'upward' },
    { id: 'Upwork-upwork-0.10-600', name: 'Upwork', price: '₦1180', code: 'upwork' },
    { id: 'USAA-usaa-0.80-900', name: 'USAA', price: '₦2265', code: 'usaa' },
    { id: 'USALLIANCE-usalliance-0.80-900', name: 'USALLIANCE', price: '₦2265', code: 'usalliance' },
    { id: 'Valued Opinions-valuedopinions-0.10-420', name: 'Valued Opinions', price: '₦1180', code: 'valuedopinions' },
    { id: 'Varo-varo-0.80-900', name: 'Varo', price: '₦2265', code: 'varo' },
    { id: 'Venmo-yy-1.30-420', name: 'Venmo', price: '₦3040', code: 'yy' },
    { id: 'Veoride-veo-0.25-420', name: 'Veoride', price: '₦1412.5', code: 'veo' },
    { id: 'Vercel-vercel-0.10-300', name: 'Vercel', price: '₦1180', code: 'vercel' },
    { id: 'Viber-vi-0.05-300', name: 'Viber', price: '₦1102.5', code: 'vi' },
    { id: 'Virgin Red-virginred-0.15-600', name: 'Virgin Red', price: '₦1257.5', code: 'virginred' },
    { id: 'VKontakte-vk-0.20-420', name: 'VKontakte', price: '₦1335', code: 'vk' },
    { id: 'WalletHub-wallethub-0.20-600', name: 'WalletHub', price: '₦1335', code: 'wallethub' },
    { id: 'Walmart-wr-0.20-420', name: 'Walmart', price: '₦1335', code: 'wr' },
    { id: 'Waymo-waymo-0.10-420', name: 'Waymo', price: '₦1180', code: 'waymo' },
    { id: 'Wealthfront-wealthfront-0.20-420', name: 'Wealthfront', price: '₦1335', code: 'wealthfront' },
    { id: 'Webull-alf-0.20-420', name: 'Webull', price: '₦1335', code: 'alf' },
    { id: 'WeChat-wb-0.50-420', name: 'WeChat', price: '₦1800', code: 'wb' },
    { id: 'Wells Fargo-wfargo-4.00-900', name: 'Wells Fargo', price: '₦7225', code: 'wfargo' },
    { id: 'Wert-wert-0.15-600', name: 'Wert', price: '₦1257.5', code: 'wert' },
    { id: 'Western Union-wu-0.50-600', name: 'Western Union', price: '₦1800', code: 'wu' },
    { id: 'Weverse-weverse-0.10-420', name: 'Weverse', price: '₦1180', code: 'weverse' },
    { id: 'Whatnot-whatnot-0.10-300', name: 'Whatnot', price: '₦1180', code: 'whatnot' },
    { id: 'Wise-bo-0.80-600', name: 'Wise', price: '₦2265', code: 'bo' },
    { id: 'Wolt-rr-0.10-420', name: 'Wolt', price: '₦1180', code: 'rr' },
    { id: 'Wonder.com-wonder-0.20-420', name: 'Wonder.com', price: '₦1335', code: 'wonder' },
    { id: 'Yahoo-mb-0.25-600', name: 'Yahoo', price: '₦1412.5', code: 'mb' },
    { id: 'Yendo-yendo-1.00-900', name: 'Yendo', price: '₦2575', code: 'yendo' },
    { id: 'Zillow-zillow-0.20-420', name: 'Zillow', price: '₦1335', code: 'zillow' },
    { id: 'Zip.co-zipco-0.50-600', name: 'Zip.co', price: '₦1800', code: 'zipco' },
    { id: 'Zoho-zoho-0.10-420', name: 'Zoho', price: '₦1180', code: 'zoho' }
  ];

  // Mock API functions - replace with real API calls later
  const fetchOrders = async () => {
    setIsLoadingOrders(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock orders data matching your API response format
      const mockOrders: Order[] = [
        {
          id: 117302,
          user_id: 5160,
          order_id: "362492822",
          code: "41702",
          service_id: null,
          serviceName: "Telegram",
          phoneNumber: "17014213731",
          country: "USA",
          amount: 2808,
          status: 1,
          expiresAt: "2025-09-24 16:16:03",
          createdAt: "2025-09-24T15:06:03.000000Z",
          updatedAt: "2025-09-24T15:08:02.000000Z",
          can_purchase: "1",
          user: {
            id: 5160,
            name: "Handsome Dwin ",
            email: "handsomedwin8@gmail.com",
            email_verified_at: null,
            status: "active",
            created_at: "2025-05-05T10:04:48.000000Z",
            updated_at: "2025-09-24T15:08:02.000000Z",
            wallet_balance: 140,
            phone: null
          }
        },
        {
          id: 117297,
          user_id: 5160,
          order_id: "362484194",
          code: "",
          service_id: null,
          serviceName: "Telegram",
          phoneNumber: "15616057019",
          country: "USA",
          amount: 2885,
          status: 2,
          expiresAt: "2025-09-24 16:02:32",
          createdAt: "2025-09-24T14:52:32.000000Z",
          updatedAt: "2025-09-24T15:05:09.000000Z",
          can_purchase: "1",
          user: {
            id: 5160,
            name: "Handsome Dwin ",
            email: "handsomedwin8@gmail.com",
            email_verified_at: null,
            status: "active",
            created_at: "2025-05-05T10:04:48.000000Z",
            updated_at: "2025-09-24T15:08:02.000000Z",
            wallet_balance: 140,
            phone: null
          }
        },
        {
          id: 84252,
          user_id: 5160,
          order_id: "300962673",
          code: "214883",
          service_id: null,
          serviceName: "WhatsApp",
          phoneNumber: "19124199608",
          country: "USA",
          amount: 1830,
          status: 1,
          expiresAt: null,
          createdAt: "2025-07-21T20:47:21.000000Z",
          updatedAt: "2025-07-21T20:48:20.000000Z",
          can_purchase: "1",
          user: {
            id: 5160,
            name: "Handsome Dwin ",
            email: "handsomedwin8@gmail.com",
            email_verified_at: null,
            status: "active",
            created_at: "2025-05-05T10:04:48.000000Z",
            updated_at: "2025-09-24T15:08:02.000000Z",
            wallet_balance: 140,
            phone: null
          }
        }
      ];
      
      setOrders(mockOrders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const handlePurchase = async () => {
    if (!selectedService) {
      setErrorMessage('Please select a service');
      return;
    }

    setIsPurchasing(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock success response
      setSuccessMessage('Order processed successfully');
      setSelectedService('');
      
      // Refresh orders after successful purchase
      await fetchOrders();
    } catch (error) {
      setErrorMessage('Could not purchase number now, try again');
    } finally {
      setIsPurchasing(false);
    }
  };

  const formatTimeRemaining = (expiresAt: string | null, status: number) => {
    if (status === 1) return '0:00';
    if (status === 2 || status > 2) return 'Expired';
    
    if (!expiresAt) return 'Expired';
    
    const now = new Date().getTime();
    const expires = new Date(expiresAt).getTime();
    const distance = expires - now;

    if (distance < 0) return 'Expired';

    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0:
        return 'bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full';
      case 1:
        return 'bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full';
      case 2:
        return 'bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full';
      default:
        return 'bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full';
    }
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case 0: return 'pending';
      case 1: return 'complete';
      case 2: return 'cancelled';
      default: return 'unknown';
    }
  };

  useEffect(() => {
    fetchOrders();
    
    // Set up periodic refresh every 12 seconds
    const interval = setInterval(fetchOrders, 12000);
    return () => clearInterval(interval);
  }, []);

  // Update timers every second
  useEffect(() => {
    const timerInterval = setInterval(() => {
      // Force re-render to update timers
      setOrders(prev => [...prev]);
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="font-bold text-xl md:text-2xl text-gray-900">
          Get a USA Number
        </h2>
      </div>

      {/* Alerts */}
      {successMessage && (
        <div className="flex items-center p-4 mb-4 text-green-800 rounded-lg bg-green-50">
          <CheckCircle className="flex-shrink-0 w-4 h-4" />
          <span className="ms-3 text-sm font-medium">{successMessage}</span>
          <button
            onClick={() => setSuccessMessage('')}
            className="ms-auto -mx-1.5 -my-1.5 bg-green-50 text-green-500 rounded-lg focus:ring-2 focus:ring-green-400 p-1.5 hover:bg-green-200"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center p-4 mb-4 text-red-800 rounded-lg bg-red-50">
          <AlertCircle className="flex-shrink-0 w-4 h-4" />
          <span className="ms-3 text-sm font-medium">{errorMessage}</span>
          <button
            onClick={() => setErrorMessage('')}
            className="ms-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Service Selection */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="mb-4">
          <label htmlFor="service" className="block mb-2 text-sm font-medium text-gray-900">
            Select Service
          </label>
          <select
            id="service"
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="block w-full p-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-nova-primary focus:border-nova-primary"
          >
            <option value="">Choose a service</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name} - {service.price}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handlePurchase}
          disabled={isPurchasing || !selectedService}
          className="text-white bg-nova-navy hover:bg-nova-secondary font-medium rounded-md text-sm px-8 py-3 text-center hover:text-white mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isPurchasing ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {/* Order History */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg md:text-xl text-gray-900">Order History</h2>
          <button
            onClick={fetchOrders}
            disabled={isLoadingOrders}
            className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingOrders ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Phone Number</th>
                <th className="px-6 py-3">Code</th>
                <th className="px-6 py-3">Service</th>
                <th className="px-6 py-3 bg-gray-50">Timer</th>
                <th className="px-6 py-3 bg-gray-50">ID</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3 bg-gray-50">Status</th>
                <th className="px-6 py-3 bg-gray-50">AC</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingOrders ? (
                <tr>
                  <td colSpan={9} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <Loader className="w-6 h-6 animate-spin text-nova-primary" />
                      <span className="ml-2">Loading orders...</span>
                    </div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-gray-500">
                    No Order Available
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-200">
                    <td className="px-6 py-4 bg-gray-50">
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>+{order.phoneNumber}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {order.code || '---'}
                    </td>
                    <td className="px-6 py-4">{order.serviceName}</td>
                    <td className="px-6 py-4 bg-gray-50">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="font-mono">
                          {formatTimeRemaining(order.expiresAt, order.status)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">
                      {order.order_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <span>{order.amount.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 bg-gray-50">
                      <span className={getStatusBadge(order.status)}>
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={order.status === 1 ? 'bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full' : 'bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full'}>
                        {order.status === 1 ? '✓' : 'X'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-gradient-to-r from-nova-primary/10 to-nova-secondary/10 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <CheckCircle className="w-6 h-6 text-nova-primary mt-1" />
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">About USA Numbers</h4>
            <p className="text-sm text-gray-600 mb-3">
              Get instant USA phone numbers for verification purposes. All numbers are compatible with major services like WhatsApp, Telegram, and more.
            </p>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Instant delivery</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Real-time SMS receiving</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Auto-refresh every 12 seconds</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyUSANumberPage;

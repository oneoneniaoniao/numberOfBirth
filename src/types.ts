export type PrefectureType = typeof prefectures[number];

const prefectures = [
  "北海道",
  "青森県",
  "岩手県",
  "宮城県",
  "秋田県",
  "山形県",
  "福島県",
  "茨城県",
  "栃木県",
  "群馬県",
  "埼玉県",
  "千葉県",
  "東京都",
  "神奈川県",
  "新潟県",
  "富山県",
  "石川県",
  "福井県",
  "山梨県",
  "長野県",
  "岐阜県",
  "静岡県",
  "愛知県",
  "三重県",
  "滋賀県",
  "京都府",
  "大阪府",
  "兵庫県",
  "奈良県",
  "和歌山県",
  "鳥取県",
  "島根県",
  "岡山県",
  "広島県",
  "山口県",
  "徳島県",
  "香川県",
  "愛媛県",
  "高知県",
  "福岡県",
  "佐賀県",
  "長崎県",
  "熊本県",
  "大分県",
  "宮崎県",
  "鹿児島県",
  "沖縄県",
] as const;

export type DemographicsDataType = typeof data;

const data = {
  message: null,
  result: {
    boundaryYear: 2020,
    data: [
      {
        label: "総人口",
        data: [
          {
            year: 2040,
            value: null
          },
          {
            year: 2045,
            value: 5324,
          },
        ],
      },
      {
        label: "転入数",
        data: [
        
          {
            year: 2019,
            value: 266,
          },
          {
            year: 2020,
            value: 229,
          },
          {
            year: 2021,
            value: 216,
          },
        ],
      },
      {
        label: "転出数",
        data: [
          {
            year: 1994,
            value: 356,
          },
          {
            year: 1995,
            value: 355,
          },
          {
            year: 2001,
            value: 374,
          },
          {
            year: 2002,
            value: 372,
          },
         
        ],
      },
      {
        label: "出生数",
        data: [
          {
            year: 1994,
            value: null,
          },
          {
            year: 1995,
            value: 99,
          },
          {
            year: 1996,
            value: 112,
          },
          {
            year: 1997,
            value: 102,
          },
          {
            year: 1998,
            value: 106,
          },
          {
            year: 1999,
            value: 96,
          },
          {
            year: 2000,
            value: 99,
          },
          {
            year: 2001,
            value: 93,
          },
        ],
      },
      {
        label: "死亡数",
        data: [
          {
            year: 1994,
            value: 130,
          },
          {
            year: 1995,
            value: 134,
          },
          {
            year: 1996,
            value: 129,
          },
          {
            year: 2021,
            value: 163,
          },
        ],
      },
    ],
  },
};

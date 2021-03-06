export default [
  {
    path: '/start',
    component: () => import('@/pages/start.vue'),
  },
  {
    path: '/login',
    meta: {
      loginBefore: true,
    },
    component: () => import('@/pages/login/layout.vue'),
    children: [
      {
        path: '',
        alias: '',
        component: () => import('@/pages/login/index.vue'),
      },
      {
        path: 'forget',
        component: () => import('@/pages/login/forget.vue'),
      },
    ],
  },
  {
    path: '/tabbar',
    alias: '',
    component: () => import('@/pages/tabbar/layout.vue'),
    children: [
      {
        path: 'home',
        alias: '',
        component: () =>
          import('@/pages/tabbar/home/layout.vue'),
        children: [
          {
            path: 'index',
            alias: '',
            component: () =>
              import('@/pages/tabbar/home/index.vue'),
          },
          {
            path: 'detail',
            component: () =>
              import('@/pages/tabbar/home/detail.vue'),
          },
        ],
      },
      {
        path: 'market',
        component: () =>
          import('@/pages/tabbar/market/layout.vue'),
        children: [
          {
            path: 'index',
            alias: '',
            component: () =>
              import('@/pages/tabbar/market/index.vue'),
          },
        ],
      },
      {
        path: 'search',
        component: () =>
          import('@/pages/tabbar/search/layout.vue'),
        children: [
          {
            path: 'index',
            alias: '',
            component: () =>
              import('@/pages/tabbar/search/index.vue'),
          },
        ],
      },
      {
        path: 'user',
        component: () =>
          import('@/pages/tabbar/user/layout.vue'),
        children: [
          {
            path: 'index',
            alias: '',
            meta: {
              loginAfter: true,
            },
            meta: { transition: 'skewDown' },
            component: () =>
              import('@/pages/tabbar/user/index.vue'),
          },
          {
            path: 'myKeep',
            meta: {
              loginAfter: true,
            },
            component: () =>
              import('@/pages/tabbar/user/myKeep.vue'),
          },
          {
            path: 'myLove',
            meta: {
              loginAfter: true,
            },
            component: () =>
              import('@/pages/tabbar/user/myLove.vue'),
          },
          {
            path: 'set',
            meta: {
              loginAfter: true,
            },
            component: () =>
              import('@/pages/tabbar/user/set/layout.vue'),
            children: [
              {
                path: 'index',
                alias: '',
                component: () =>
                  import(
                    '@/pages/tabbar/user/set/index.vue'
                  ),
              },
              {
                path: 'avatar',
                component: () =>
                  import(
                    '@/pages/tabbar/user/set/avatar.vue'
                  ),
              },
              {
                path: 'username',
                component: () =>
                  import(
                    '@/pages/tabbar/user/set/username.vue'
                  ),
              },
              {
                path: 'sex',
                component: () =>
                  import('@/pages/tabbar/user/set/sex.vue'),
              },
              {
                path: 'intro',
                component: () =>
                  import(
                    '@/pages/tabbar/user/set/intro.vue'
                  ),
              },
              {
                path: 'auth',
                component: () =>
                  import(
                    '@/pages/tabbar/user/set/auth.vue'
                  ),
              },
              {
                path: 'payPassword',
                component: () =>
                  import(
                    '@/pages/tabbar/user/set/payPassword.vue'
                  ),
              },
              {
                path: 'loginPassword',
                component: () =>
                  import(
                    '@/pages/tabbar/user/set/loginPassword.vue'
                  ),
              },
              {
                path: 'threePay',
                component: () =>
                  import(
                    '@/pages/tabbar/user/set/threePay.vue'
                  ),
              },
              {
                path: 'bankPay',
                component: () =>
                  import(
                    '@/pages/tabbar/user/set/bankPay.vue'
                  ),
              },
              {
                path: 'addBankPay',
                component: () =>
                  import(
                    '@/pages/tabbar/user/set/addBankPay.vue'
                  ),
              },
            ],
          },
          {
            path: 'creator',
            component: () =>
              import(
                '@/pages/tabbar/user/creator/layout.vue'
              ),
            children: [
              {
                path: 'index',
                alias: '',
                meta: {
                  transition: 'skewUp',
                  loginAfter: true,
                },
                component: () =>
                  import(
                    '@/pages/tabbar/user/creator/index.vue'
                  ),
              },
              {
                path: 'avatar',
                meta: {
                  loginAfter: true,
                },
                component: () =>
                  import(
                    '@/pages/tabbar/user/creator/avatar.vue'
                  ),
              },
              {
                path: 'intro',
                meta: {
                  loginAfter: true,
                },
                component: () =>
                  import(
                    '@/pages/tabbar/user/creator/intro.vue'
                  ),
              },
              {
                path: 'privacy',
                meta: {
                  loginAfter: true,
                },
                component: () =>
                  import(
                    '@/pages/tabbar/user/creator/privacy.vue'
                  ),
              },
              {
                path: 'myFans',
                meta: {
                  loginAfter: true,
                },
                component: () =>
                  import(
                    '@/pages/tabbar/user/creator/myFans.vue'
                  ),
              },
              {
                path: 'recommend',
                meta: {
                  loginAfter: true,
                },
                component: () =>
                  import(
                    '@/pages/tabbar/user/creator/recommend.vue'
                  ),
              },
              {
                path: 'show',
                component: () =>
                  import(
                    '@/pages/tabbar/user/creator/show.vue'
                  ),
              },
            ],
          },
          {
            path: 'wallet',
            meta: {
              loginAfter: true,
            },
            component: () =>
              import(
                '@/pages/tabbar/user/wallet/layout.vue'
              ),
            children: [
              {
                path: 'index',
                alias: '',
                component: () =>
                  import(
                    '@/pages/tabbar/user/wallet/index.vue'
                  ),
              },
              {
                path: 'extractRecord',
                component: () =>
                  import(
                    '@/pages/tabbar/user/wallet/extractRecord.vue'
                  ),
              },
            ],
          },
          {
            path: 'collect',
            meta: {
              loginAfter: true,
            },
            component: () =>
              import(
                '@/pages/tabbar/user/collect/layout.vue'
              ),
            children: [
              {
                path: 'index',
                alias: '',
                component: () =>
                  import(
                    '@/pages/tabbar/user/collect/index.vue'
                  ),
              },
            ],
          },
          {
            path: 'contract',
            meta: {
              loginAfter: true,
            },
            component: () =>
              import(
                '@/pages/tabbar/user/contract/layout.vue'
              ),
            children: [
              {
                path: 'index',
                alias: '',
                component: () =>
                  import(
                    '@/pages/tabbar/user/contract/index.vue'
                  ),
              },
            ],
          },
          {
            path: 'createNFT',
            meta: {
              loginAfter: true,
            },
            component: () =>
              import(
                '@/pages/tabbar/user/createNFT/layout.vue'
              ),
            children: [
              {
                path: 'index',
                alias: '',
                component: () =>
                  import(
                    '@/pages/tabbar/user/createNFT/index.vue'
                  ),
              },
            ],
          },
          {
            path: 'sell',
            meta: {
              loginAfter: true,
            },
            component: () =>
              import(
                '@/pages/tabbar/user/sell/layout.vue'
              ),
            children: [
              {
                path: 'index',
                alias: '',
                component: () =>
                  import(
                    '@/pages/tabbar/user/sell/index.vue'
                  ),
              },
            ],
          },
          {
            path: 'buy',
            meta: {
              loginAfter: true,
            },
            component: () =>
              import(
                '@/pages/tabbar/user/buy/layout.vue'
              ),
            children: [
              {
                path: 'index',
                alias: '',
                component: () =>
                  import(
                    '@/pages/tabbar/user/buy/index.vue'
                  ),
              },
            ],
          },
          {
            path: 'publish',
            meta: {
              loginAfter: true,
            },
            component: () =>
              import(
                '@/pages/tabbar/user/publish/layout.vue'
              ),
            children: [
              {
                path: 'index',
                alias: '',
                component: () =>
                  import(
                    '@/pages/tabbar/user/publish/index.vue'
                  ),
              },
            ],
          },
          {
            path: 'order',
            meta: {
              loginAfter: true,
            },
            component: () =>
              import(
                '@/pages/tabbar/user/order/layout.vue'
              ),
            children: [
              {
                path: 'index',
                alias: '',
                component: () =>
                  import(
                    '@/pages/tabbar/user/order/index.vue'
                  ),
              },
            ],
          }
        ],
      },
    ],
  },
  {
    path: '/content',
    component: () => import('@/pages/content/layout.vue'),
    children: [
      {
        path: 'userAgreement',
        alias: '',
        component: () => import('@/pages/content/userAgreement.vue'),
      },
      {
        path: 'agreement',
        alias: '',
        component: () => import('@/pages/content/agreement.vue'),
      },
      {
        path: 'zhuzao',
        alias: '',
        component: () => import('@/pages/content/zhuzao.vue'),
      },
    ],
  },
  {
    path: '/verifyAuth',
    component: () => import('@/pages/verifyAuth.vue'),
  },
];

<script>
  import {commonJS} from '@/script/common.js'

  const defaultSubPages = [
    {path: '', name: '', subTitle: '', requiresAuth: false},
    {path: 'write', name: 'Write', subTitle: ' 작성', requiresAuth: true},
    {path: 'update/:id', name: 'Update', subTitle: ' 수정', requiresAuth: true},
    {path: ':id', name: 'Detail', subTitle: ' 상세', requiresAuth: false},
  ]

  const defaultChildrenList = (path, title, subTitle, level = 999) => {
    return defaultSubPages.map((defaultChildren) => {
      return {
        path: defaultChildren.path,
        meta: {
          title: title,
          subTitle: subTitle + defaultChildren.subTitle,
          requiresAuth: defaultChildren.requiresAuth,
          level: level
        },
        component: `${commonJS.toPascalCase(path + defaultChildren.name)}`
      }
    })
  }

  const mainMenus = [
    {
      path: '/:pathMatch(.*)*', // URL path
      title: 'NotFound',
      meta: {
        title: 'NotFound',
        subTitle: '요청하신 페이지를 찾을 수 없습니다',
      },
      component: 'NotFound'
    },
    {
      path: '', // URL path
      type: '', // SIDE OR NULL
      title: 'HOME',
      meta: {
        title: 'HOME',
        subTitle: '개발자 개인 블로그',
      },
      component: 'HomePage'
    },
    {
      path: 'login',
      title: 'LOGIN',
      meta: {
        title: 'LOGIN',
        subTitle: '로그인'
      }
      , component: 'Login'
    },
    {
      path: 'user-join',
      title: '회원가입',
      meta: {
        title: '회원가입',
      }
      , component: 'UserJoin'
    },
    {
      path: 'profile',
      type: 'side',
      title: 'profile',
      meta: {
        title: 'profile',
        requiresAuth: false,
        level: 9,
      },
      level: 9,
      component: 'Profile'
    },
    {
      path: 'free-board',
      type: 'side',
      title: '자유게시판',
      component: 'RouterView',
      children: defaultChildrenList('free-board', '자유게시판', '자유게시판')
    },
    {
      path: 'tip-board',
      type: 'side',
      title: '팁 게시판',
      component: 'RouterView',
      children: defaultChildrenList('tip-board', '팁 게시판', '팁 게시판')
    },
    {
      path: 'error-log',
      type: 'side',
      title: '오류로그',
      component: 'RouterView',
      children: defaultChildrenList('error-log', '오류 로그', '오류 로그')
    },
    {
      path: 'user-info',
      type: 'side',
      title: '회원 정보',
      level: 1,
      component: 'RouterView',
      children: defaultChildrenList('user-info', '회원 정보', '회원 정보', 1)
    },
    {
      path: 'code-info',
      type: 'side',
      title: '코드관리',
      meta: {
        title: '코드관리',
        subTitle: '코드관리',
        level: 1
      },
      level: 1,
      component: 'CodeInfo',
    }
  ]

  export const COMMON_MAIN_MENU = mainMenus;
</script>
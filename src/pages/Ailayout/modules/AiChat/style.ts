import styled from 'styled-components'

export const LayoutWrapper = styled.div`
  background-color: #fff;
  height: 100%;
  /* height: 100vh; */
  font-size: 16px;
  .top {
    height: 30px;
    font-weight: bolder;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #679efe;
  }
  .spin-wrapper {
    height: calc(100% - 30px);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .content {
    > span {
      color: #679efe;
    }
    height: calc(100% - 210px);
    overflow-y: scroll;
    padding-left: 12px;
    &::-webkit-scrollbar {
      width: 12px;
      height: 12px;
      background-color: #fff;
    }
    &::-webkit-scrollbar-track {
      background-color: #fff;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #ccc;
      border-radius: 8px;
    }
    .msg-item {
      width: 800px;
      margin: 0 auto;
      .user-msg {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding-left: 12px;
        .user-content {
          background-color: #ebf5ff;
          border-radius: 16px;
          padding: 10px 16px;
          font-size: 16px;
          line-height: 26px;
        }
      }
    }
  }
  .tip-row {
    height: 30px;
    line-height: 30px;
    text-align: center;
    font-size: 10px;
    color: #eee;
  }
`

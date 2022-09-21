/* 결제 진행 함수 (2022-09-04 이수) - * 정보가 유출되지 않도록 유의해 주세요!!* */
function pay(name,email,phone,address,postcode,totalPrice) {
    
    if ( document.getElementById( 'recipientname' ).value == "" || document.getElementById( 'email' ).value == "" ||
    document.getElementById( 'phone' ).value == "" || document.getElementById( 'address' ).value == "" || 
    document.getElementById( 'postcode' ).value == "") {
        alert("수령자 정보를 재대로 입력해주세요.");
    }
    else {
        let code = 'iamport'; // 'iamport' 대신 부여받은 "가맹점 식별코드"를 사용   // ** 정보가 유출되지 않도록 유의해 주세요!! (2022-09-04 이수)**
        let IMP = window.IMP; // [생략가능] window : 전역객체를 의미(현재 창 자신을 의미) (2022-09-04 이수)
        IMP.init(code); 
        let msg;

        IMP.request_pay({
            pg : 'kakaopay',
            pay_method : 'card',
            merchant_uid : 'merchant_' + new Date().getTime(),
            name : 'KH Books 도서 결제',
            amount : totalPrice,
            buyer_email : email,
            buyer_name : name,
            buyer_tel : phone,
            buyer_addr : address,
            buyer_postcode : postcode 
            //m_redirect_url : 'http://www.naver.com'
        }, function(rsp) {
            if ( rsp.success ) {
                //[1] 서버단에서 결제정보 조회를 위해 jQuery ajax로 imp_uid 전달하기
                jQuery.ajax({
                    url: "/payments/complete", //cross-domain error가 발생하지 않도록 주의해주세요
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        imp_uid : rsp.imp_uid
                        //기타 필요한 데이터가 있으면 추가 전달
                    }
                }).done(function(data) {
                    //[2] 서버에서 REST API로 결제정보확인 및 서비스루틴이 정상적인 경우
                    if ( everythings_fine ) {
                        msg = '결제가 완료되었습니다.';
                        msg += '\n고유ID : ' + rsp.imp_uid;
                        msg += '\n상점 거래ID : ' + rsp.merchant_uid;
                        msg += '\n결제 금액 : ' + rsp.paid_amount;
                        msg += '\n카드 승인번호 : ' + rsp.apply_num;
                        
                        alert(msg);
                    } else {
                        //[3] 아직 제대로 결제가 되지 않았습니다.
                        //[4] 결제된 금액이 요청한 금액과 달라 결제를 자동취소처리하였습니다.
                    }
                });
                //성공시 이동할 페이지
                location.href='<%=request.getContextPath()%>/order/paySuccess?msg='+msg;
            } else {
                msg = '결제에 실패하였습니다.';
                msg += '에러내용 : ' + rsp.error_msg;
                //실패시 이동할 페이지
                location.href="<%=request.getContextPath()%>/order/payFail";
                alert(msg);
            }
        });
    }
}
// -------------------------------------------------------------------------------------------- //
// Index Page

// back to top scroll button

var btn = $('.index-page #back-to-top-button');

$(window).scroll(function() {
  if ($(window).scrollTop() > 300) {
    btn.addClass('show');
  } else {
    btn.removeClass('show');
  }
});

btn.on('click', function(e) {
  e.preventDefault();
  $('html, body').animate({scrollTop:0}, '300');
});

function editStatus(element) {
    const statusId = element.dataset.status
    const authorId = element.dataset.user
    const userId = document.querySelector('.index-page .multi-card').dataset.user

    if (userId == authorId) {
        $(`.index-page .card-${statusId} .dropdown-edit-status .dropdowns`).toggleClass('active');
    }
}

// window.parent.location.origin = http://localhost:3000
function showModalUserLike(element) {
    const statusId = element.dataset.status
    // console.log(statusId)
    $(`.index-page #showUserLikeModal${statusId}`).modal()
}

function liEditStatus(element) {
    $('.index-page #modalEditStatus .video-col-modal-edit').hide()
    $('.index-page #modalEditStatus .image-col-modal-edit').hide()
    var status = element.dataset.status
    $('.index-page #modalEditStatus').attr('data-status', status)
    $('.index-page #modalEditStatus .addPreview').html("")
    $('.index-page #modalEditStatus #youtubeUrlEditStatus').val("")
    $('.index-page #modalEditStatus #statusTitleEditStatus').val("")
}

function liDeleteStatus(element) {
    var status = element.dataset.status
    $('.index-page #modalDeleteStatus').attr('data-status', status)
}

function showVideoEditModal(element) {
    $('.index-page #modalEditStatus .addPreview').html("")
    $('.index-page #modalEditStatus .video-col-modal-edit').show()
    $('.index-page #modalEditStatus .image-col-modal-edit').hide()
}

function showImageEditModal(element) {
    $('.index-page #modalEditStatus .video-col-modal-edit').hide()
    $('.index-page #modalEditStatus .image-col-modal-edit').show()
}

function readURL(input) {
    if (input.files && input.files[0]) {
  
        var reader = new FileReader();
        reader.onload = function(e) {
            $('.index-page .addPreview').html(`
            <div class="preview-image-status-upload-modal-edit" id="preview-image-status-upload-modal-edit">
                <i class="fas fa-times" onclick="removePreviewImageEditStatus(this)">
                    <img src="${e.target.result}" width="200px" height="200px" id="imgPreview">
                </i>
            </div>
            `)
        };
        reader.readAsDataURL(input.files[0]);
      }
}

function removePreviewImageEditStatus() {
    var temp = document.getElementById('preview-image-status-upload-modal-edit')
    temp.remove()
}

function readURLImgUser(input) {
    if (input.files && input.files[0]) {
  
        var reader = new FileReader();
        reader.onload = function(e) {
            $('.profile-page .addPreview').html(`
            <div class="preview-image-status-upload-modal-edit" id="preview-image-status-upload-modal-edit-user">
                <i class="fas fa-times" onclick="removePreviewImageEditImgUser(this)">
                    <img src="${e.target.result}" width="200px" height="200px" id="imgPreview">
                </i>
            </div>
            `)
        };
        reader.readAsDataURL(input.files[0]);
      }
}
function removePreviewImageEditImgUser() {
    var temp = document.getElementById('preview-image-status-upload-modal-edit-user')
    temp.remove()
}

function showHideComments(element) {
    const statusId = element.dataset.status
    $(`.index-page .comments${statusId}`).slideToggle("slow");
}

function focusPostBtnComment(element) {
    $(`.index-page .comments #text-content-comment${element.dataset.status}`).focus()
}
// -------------------------------------------------------------------------------------------
    // comment
function showCommentsStatus(element) {
    const statusId = element.dataset.status
    const commentLength = $(`.index-page .comments .card-comments-user${statusId}`).children().length
    // console.log(`số comment:${commentLength} của id ${statusId}`)
    fetch(`/comment/status/${statusId}/${commentLength}`,{
        method: 'GET'
    })
    .then(res => res.text())
    .then(async data => {
        data = JSON.parse(data)
        if (data.success) {
            if (data.Comment.length === 0) {
                $(`.index-page .comments${statusId} .preview-comments-before`).hide()
                $(`.index-page .comments .check-loading-preview-${statusId}`).hide()
                $(`.index-page .comments .notification-preview-comments-${statusId}`).show()
            }
            else {
                $(`.index-page .comments .check-loading-preview-${statusId}`).show()
                let dataStringCard = data.Comment.map(async comment => {
                    const {nameAuthor, imgAuthor} = await fetch(`/user/${comment.author}`, {
                        method: 'GET'
                    })
                    .then(res => res.text())
                    .then(dataAuthor => {
                        dataAuthor = JSON.parse(dataAuthor)
                        if (dataAuthor.success) {
                            const nameAuthor = dataAuthor.user.name
                            const imgAuthor = dataAuthor.user.image
                            // console.log(imgAuthor)
                            return {nameAuthor: nameAuthor,imgAuthor: imgAuthor}
                        }
                        else {
                            return {nameAuthor: undefined,imgAuthor: undefined}
                        }
                    }).catch(e => console.log(e))
                    comment["nameAuthor"] = nameAuthor
                    comment["imgAuthor"] = imgAuthor
    
                    stringCardComment = `
                    <div class="d-flex flex-row mb-2">
                        <a href="./profile?id=${comment.author}">
                            <img src="${comment.imgAuthor}" width="40" class="round-img">
                        </a>
                        <div class="d-flex flex-column ml-2">
                            <span class="nameOfUser">${comment.nameAuthor}</span>
                            <small class="comment-text">${comment.content}</small>
                            <div
                                class="d-flex flex-row align-items-center interactive_comment_color">
                                <small>Thích</small>
                                <small>Trả lời</small>
                                <small>Dịch</small>
                                <small>${getPassedTime(new Date(comment.dateModified),Date.now())}</small>
                            </div>
                        </div>
                    </div>
                    `
                    return stringCardComment
                });
                let arrayStringCard = await Promise.all(dataStringCard)
                temp = ""
                arrayStringCard.forEach(stringCard => {
                    temp += stringCard
                });
                $(`.index-page .comments${statusId} .card-comments-user`).append(temp)
                $(`.index-page .comments .check-loading-preview-${statusId}`).hide()
            }
        }
    }).catch(e => console.log(e))
}
function fetchApiComment(element) {
    const statusId = element.dataset.status
    const author = element.dataset.author
    const content = document.getElementById(`text-content-comment${statusId}`).value;
    var data = {
        statusId: statusId,
        author: author,
        content: content
    }
    $(document).ready(function () {
        fetch(window.parent.location.origin + '/comment',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(data => {
            // console.log(data)
        }).catch(e => console.log(e))
    })
}
// -------------------------------------------------------------------------------------------
// getLikeStatus

function getLikeStatus(element) {
    const idStatus = element.dataset.id
    const userImage = document.querySelector('.index-page').dataset.image
    const userId = document.querySelector('.index-page').dataset.userid
    const name = document.querySelector('.index-page').dataset.name
    let myLike = undefined
    // console.log("id status:",idStatus)
    // console.log("userImage:", userImage)
    // console.log("userId:",userId)
    // console.log("name:",name)
    $(document).ready(function () {

        // set scroll on top page default
        window.onbeforeunload = function () {
            window.scrollTo(0, 0);
        }

        fetch(`/status/${idStatus}`,{
            method: 'GET'
        })
        .then(res => res.json())
        .then(data => {
            if (data.Status.like === undefined || data.Status.like === null) {
                $(`.${idStatus}`).addClass("liked");
                
                likes = []
                myLike = {
                    image : userImage,
                    _id : userId,
                    name : name
                }
                likes.push(myLike)
                $(`.view-${idStatus}`).text(likes.length)
                // console.log(like)
                data.Status.like = (JSON.stringify(likes))
            }
            else {
                likes = JSON.parse(data.Status.like)
                // console.log(likes)
                // console.log(idStatus)
                // kiểm tra user đã like bài viết hay chưa
                let new_likes = []
                let check_user_like = false
                // console.log("old likes:",likes.length)
                likes.forEach((like,index) => {
                    if (like._id === userId) {
                        check_user_like = true
                    }
                    else {
                        new_likes.push(like)
                    }
                });
                // console.log("new likes:",new_likes.length)
                if (check_user_like) {
                    $(`.${idStatus}`).removeClass("liked");
                    $(`.view-${idStatus}`).text(new_likes.length)
                    // gỡ lượt thích bài viết của user
                    data.Status.like = (JSON.stringify(new_likes))
                }
                else {
                    $(`.${idStatus}`).addClass("liked");
                    // tạo lượt thích bài viết cho user
                    myLike = {
                        image : userImage,
                        _id : userId,
                        name : name
                    }
                    likes.push(myLike)
                    $(`.view-${idStatus}`).text(likes.length)
                    // console.log("likes new:",likes.length)
                    data.Status.like = (JSON.stringify(likes))
                }
            }
            // console.log(data.Status)
            fetch(`/status/like/${idStatus}`,{
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data.Status)
            })
            .then(res => res.json())
            .then(json => {
                if (json.success) {
                    // console.log(json.message)
                }
            }).catch(e => console.log(e))
        })
    })
}
// -------------------------------------------------------------------------------------------
$(document).ready(async function () {
    $('.index-page .gap2 .container .row .loader').hide()
    if($(".login-page")[0]){
 
        $("#login_form").submit(e=>{
            e.preventDefault()
            const [username, password, remember_me] = $("#login_form").serializeArray();
            $("#login_form .spinner-border").fadeIn()
            $.post( "/auth",{username: username.value, password:password.value, remember_me:remember_me.value}, function( data ) {
                if(!data.error){
                    location.reload();
                }else{
                    $("#login_form .spinner-border").fadeOut("fast")
                    $("#login_form .login-content-error").text(data.error)
                    $("#login_form .show-error-login").fadeIn("slow");
    
                }
            });
        })
        $("#login_form input").keypress(function(){
            $("#login_form .show-error-login").fadeOut("slow");
        })
    }
    const socket = io()
    socket.on('connect', handleConnectionSuccess);
    socket.on('disconnect', () => {
        console.log("Mat ket noi voi server");
    });
    socket.on('list-users', handleUserList);
    // -------------------------------------------------------------------------------------------
    // socket add notification

    socket.on('add-notification', (data) => {
        
        $(".notificationPage .list-notification").prepend(
            ` <li class="list-group-item">
                <h4 class="title" >${data.title}</h4>
                <div class="content">
                    <a href="/notification/${data.department}/${data.id}">Chi tiết thông báo</a>
                </div>
                <p class="font-italic">[${data.departmentName }] - ${new Date(data.createAt).toJSON().slice(0,10).split('-').reverse().join('-')}</p>
            </li>`)

        $("#getNotification").fadeIn()
        
        $("#getNotification strong").text(data.departmentName +" Đã đăng một thông báo")
        $("#getNotification small").text(Math.floor((Date.now() - data.createAt) / 1000) +" giây trước")
        $("#getNotification .toast-body").text(data.title)
        $(".toast").toast('show')
        $(".vertical-timeline").prepend(`
        <div class="vertical-timeline-item vertical-timeline-element">
            <div>
                <span class="vertical-timeline-element-icon bounce-in">
                    <i class="far fa-dot-circle"></i>
                </span>
                <div class="vertical-timeline-element-content bounce-in">
                    <h4 class="timeline-title">${data.departmentName}</h4>
                    <p>${data.title}</p>
                    <a href="/notification/${data.department}/${data.id}">Xem chi tiết</a>
                    <span class="vertical-timeline-element-date" data-time=${data.createAt}>${getPassedTime(data.createAt,Date.now())}</span>
                </div>
            </div>
        </div>
    `)
        $("#getNotification").delay(5000).fadeOut()

    });
    // -------------------------------------------------------------------------------------------
    // socket add comment

    socket.on('add-comment', (data) => {
        // console.log("data comment:",data)
        fetch(`/user/${data.author}`, {
            method: 'GET'
        })
        .then(res => res.json())
        .then(json => {
            // console.log('data user:',json)
            if (json.success) {
                $(`.index-page .comments${data.statusId} .card-comments-user`).prepend(
                    `<div class="d-flex flex-row mb-2">
                        <a href="./profile?id=${json.user._id}"><img src="${json.user.image}" width="40" class="round-img"></a>
                        <div class="d-flex flex-column ml-2"> <span
                                class="nameOfUser">${json.user.name}</span>
                                <small class="comment-text">${data.content}</small>
                            <div
                                class="d-flex flex-row align-items-center interactive_comment_color">
                                <small>Thích</small>
                                <small>Trả lời</small>
                                <small>Dịch</small>
                                <small>${getPassedTime(new Date(data.dateModified),Date.now())}</small>
                            </div>
                        </div>
                    </div>`
                )

                // set input content comment = ""
                $(`.index-page .comment-input #text-content-comment${data.statusId}`).val("");
            }
        }).catch(e => console.log(e))

    })

    function handleUserList(user){
        console.log(user)
    }
    function handleConnectionSuccess(){
        console.log("da ket noi thanh cong voi id"+socket.id);
        let userId = '<%= user.id %>'
        socket.emit('register-id', {socketId:socket.id,userId:userId }) //gui id qua cho server
    }

    // -------------------------------------------------------------------------------------------
    /*--- left menu full ---*/
    $(' .menu-small').on("click", function () {
        $(".fixed-sidebar.left").addClass("open");
    });
    $('.closd-f-menu').on("click", function () {
        $(".fixed-sidebar.left").removeClass("open");
    });
    // -------------------------------------------------------------------------------------------
    /*--- show - hide form upload link youtube ---*/
    $('.index-page .attachments .fileContainer #youtubeVideoUpload').on('click', () => {
        $('.index-page .attachments .input-link-youtube').toggleClass("active")
    })
    // -------------------------------------------------------------------------------------------
    /*--- show emoji ---*/
    $('.index-page .attachments .fileContainer #emojiSelector').on('click', () => {
        $('emoji-picker').toggleClass("emoji-display")
    })
    let emoji = document.querySelector('emoji-picker')
    if (emoji) {
        emoji.addEventListener('emoji-click', event => {
            let value = $('.index-page textarea.statusTitle').val()
            let emoji = event.detail.emoji.unicode
            let newValue = value + emoji
            $('.index-page textarea.statusTitle').val(newValue)
        });
    }
    $(document).on('click', function(e) {
        let emojiBtn = $('.index-page .attachments .fileContainer #emojiSelector')
        if (!$(e.target).closest(emojiBtn).length && !$(e.target).closest($('emoji-picker')).length) {
            $('emoji-picker').removeClass("emoji-display")
        }
        let dropdownEditDeleteStatus = $(`.index-page .dropdown-edit-status .dropdowns`)
        if (!$(e.target).closest(dropdownEditDeleteStatus).length && !$(e.target).closest($('.index-page .multi-card .card .time-and-more')).length) {
            dropdownEditDeleteStatus.removeClass("active")
        }
    });
    // -------------------------------------------------------------------------------------------
    // edit profile user
    $('.profile-page #edit-btn-basic-information').on('click' , e => {
        $('.profile-page .edit-info-basic-form').fadeIn()

        $('.profile-page .btn-primary-cancel-edit-basic-form').on('click', e => {
            $('.profile-page .edit-info-basic-form').fadeOut()
        })
    })
    $('.profile-page #edit-btn-contact-information').on('click' , e => {
        $('.profile-page .edit-info-contact-form').fadeIn()

        $('.profile-page .btn-primary-cancel-edit-contact-form').on('click', e => {
            $('.profile-page .edit-info-contact-form').fadeOut()
        })
    })
    $('.profile-page #edit-save-basic-user-information').on('click', e => {
        const id = e.target.dataset.user
        const name = $('.profile-page .edit-info-basic-form #name-user').val()
        const gender = $('input[name=radio]:checked', '.profile-page #form-select-gender').val()
        const birth = $('.profile-page .edit-info-basic-form #birth-user').val()
        const faculty = $('.profile-page .edit-info-basic-form #faculty-user').val()
        const major = $('.profile-page .edit-info-basic-form #major-user').val()

        // console.log(`${name}   ${gender}  ${birth} ${address} ${faculty} ${major}`)

        const query = {
            name, gender, birth, faculty, major
        }
        fetch(`./user/basic/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(query)
        }).then(res => res.text())
        .then(data => {
            data = JSON.parse(data)
            if (data.status) {
                let newBirth = new Date(birth)
                $('.profile-page .social-main-faculty').html(faculty)
                $('.profile-page .social-main-major').html(major)
                $('.profile-page #social-name-ajax').html(name)
                $('.profile-page #social-gender-ajax').html(gender)
                $('.profile-page #social-birth-ajax').html(moment(newBirth).format('DD/MM/YYYY'))
                $('.profile-page #social-faculty-ajax').html(faculty)
                $('.profile-page #social-major-ajax').html(major)

                $('.messsageAlertPage #message-alert-show .content').html(data.message)
                $('.messsageAlertPage #message-alert-show').fadeIn();
    
                setTimeout(() => {
                    $('.messsageAlertPage #message-alert-show').fadeOut();
                },3000)

                $('.profile-page .edit-info-basic-form #name-user').val("")
                $('.profile-page .edit-info-basic-form #address-user').val("")
                $('.profile-page .edit-info-basic-form #faculty-user').val("")
                $('.profile-page .edit-info-basic-form #major-user').val("")

                $('.profile-page .btn-primary-cancel-edit-basic-form').trigger('click')
            }
            else {
                $('.messsageAlertPage #message-alert-show .content').html(data.error)
                $('.messsageAlertPage #message-alert-show').fadeIn();
    
                setTimeout(() => {
                    $('.messsageAlertPage #message-alert-show').fadeOut();
                },3000)
            }
        }).catch(e => {
            $('.messsageAlertPage #message-alert-show .content').html(e.message)
            $('.messsageAlertPage #message-alert-show').fadeIn();

            setTimeout(() => {
                $('.messsageAlertPage #message-alert-show').fadeOut();
            },3000)
        })
    })
    $('.profile-page #edit-save-contact-user-information').on('click', e => {
        const id = e.target.dataset.user
        const phone = $('.profile-page .edit-info-contact-form #social-phone-contact-edit').val()
        const address = $('.profile-page .edit-info-contact-form #social-address-contact-edit').val()

        const query = {
            phone, address
        }
        fetch(`./user/contact/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(query)
        }).then(res => res.text())
        .then(data => {
            console.log(data)
            data = JSON.parse(data)
            if (data.status) {
                $('.profile-page #social-contact-phone-edit').html(phone)
                $('.profile-page #social-contact-address-edit').html(address)

                $('.messsageAlertPage #message-alert-show .content').html(data.message)
                $('.messsageAlertPage #message-alert-show').fadeIn();
    
                setTimeout(() => {
                    $('.messsageAlertPage #message-alert-show').fadeOut();
                },3000)

                $('.profile-page .edit-info-contact-form #social-phone-contact-edit').val("")
                $('.profile-page .edit-info-contact-form #social-address-contact-edit').val("")

                $('.profile-page .btn-primary-cancel-edit-contact-form').trigger('click')
            }
            else {
                $('.messsageAlertPage #message-alert-show .content').html(data.error)
                $('.messsageAlertPage #message-alert-show').fadeIn();
    
                setTimeout(() => {
                    $('.messsageAlertPage #message-alert-show').fadeOut();
                },3000)
            }
        }).catch(e => {
            $('.messsageAlertPage #message-alert-show .content').html(e.message)
            $('.messsageAlertPage #message-alert-show').fadeIn();

            setTimeout(() => {
                $('.messsageAlertPage #message-alert-show').fadeOut();
            },3000)
        })
    })
    // -------------------------------------------------------------------------------------------
    //--- user setting dropdown on topbar
    $('.user-img').on('click', function () {
        // toggleClass(): Thêm hoặc loại bỏ một hoặc nhiều class của thành phần.
        $('.user-setting').toggleClass("active");
    });

    $('.gap2 .container').on('click', function () {
        // hide all when click index page
        $('.user-setting').removeClass("active");
        $(".fixed-sidebar.left").removeClass("open");
        $(".top-area > .setting-area > li > a").removeClass('active');
        $('.index-page .side-panel').removeClass('active');
    });

    // top menu list
    $('.main-menu > span').on('click', function () {
        // slideToggle(): Hiển thị và ẩn các thành phần phù hợp với hiệu ứng chuyển động trượt (slide).
        $('.nav-list').slideToggle(300);
    });

    $('.setting-all').on('click', function() {
        $('.side-panel').toggleClass('active');
    });

    $('.index-page .post-btn-preview').on('click', function() {
        $('.index-page .preview-image-upload').toggleClass('active');
    });
    // -------------------------------------------------------------------------------------------
    //------- Notifications Dropdowns
    // $('.top-area > .setting-area > li > a > ').on("click",function(){
    //     var $parent = $(this).parent('li');
    //     $(this).addClass('active').parent().siblings().children('a').removeClass('active');
    //     $parent.siblings().children('div').removeClass('active');
    //     $(this).siblings('div').toggleClass('active');
    //     return false;
    // });

    $('.top-area > .setting-area > .notification-status').on("click", function () {
        $('.notification-status .dropdowns').toggleClass("active");
    });

    // New submit post box
    $(".new-postbox").click(function () {
        $(".postoverlay").fadeIn(500);
    });
    $(".postoverlay").not(".new-postbox").click(function () {
        $(".postoverlay").fadeOut(500);
    });
    $("[type = submit]").click(function () {
        var post = $("textarea").val();
        $("<p class='post'>" + post + "</p>").appendTo("section");
    });

    //---- responsive header -> create menu jquery canvas
    if ($.isFunction($.fn.mmenu)) {
        $(function () {
            //	create the menus
            $('#menu').mmenu();
        });
    }
    // -------------------------------------------------------------------------------------------
    // close message alert
    $('.messsageAlertPage #message-alert-show .close').click(e => {
        $('.messsageAlertPage #message-alert-show').fadeOut();
    })
    // -------------------------------------------------------------------------------------------
    // preview image uploaded
    $(document).delegate('.index-page .image-upload-preview .close-icon', 'click', function () {
        $('.index-page .image-upload-preview').slideToggle(300, 'swing');
        $(".index-page #imageUpload").val(null)
        setTimeout(() => {
            $("#output").attr("src", null)
        }, 300);
    })
    $('.index-page #imageUpload').change(e => {
        var file = e.target.files[0]
        // console.log(file)
        
        var reader = new FileReader();
        reader.onload = function () {
            var output = document.getElementById('output');
            output.src = reader.result;
        };
        reader.readAsDataURL(file);
        $(".image-upload-preview").css("display", "block")
        $('.index-page .preview-image-upload').addClass('active');
    })
    // -------------------------------------------------------------------------------------------
    // delete status
    $('.index-page #modalDeleteStatus #deleteStatusByIdBtn').on('click', e => {
        $('.index-page #modalDeleteStatus #deleteStatusByIdBtn .fa-spinner').show()
        var status = $('.index-page #modalDeleteStatus').attr('data-status')

        fetch(`./status/${status}`, {
            method: 'DELETE'
        }).then(res => res.text())
        .then(data => {
            data = JSON.parse(data)
            if (data.status) {
                $(`.index-page .card-${status}`).remove()
                $(`.index-page #showUserLikeModal${status}`).remove()
                
                $('.messsageAlertPage #message-alert-show .content').html(data.message)
                $('.messsageAlertPage #message-alert-show').fadeIn();
    
                setTimeout(() => {
                    $('.messsageAlertPage #message-alert-show').fadeOut();
                },3000)

                $('.index-page #modalDeleteStatus').modal('hide')
            }
            $('.index-page #modalDeleteStatus #deleteStatusByIdBtn .fa-spinner').hide()
        }).catch(e => {
            $('.index-page #modalDeleteStatus #deleteStatusByIdBtn .fa-spinner').hide()
            $('.messsageAlertPage #message-alert-show .content').html(e.message)
            $('.messsageAlertPage #message-alert-show').fadeIn();

            setTimeout(() => {
                $('.messsageAlertPage #message-alert-show').fadeOut();
            },3000)
        })
    })
    // Edit avatar user
    $('.profile-page #modalEditImgUser #updateImgUserBtn').on('click', e => {
        $('.profile-page #modalEditImgUser #updateImgUserBtn .fa-spinner').show()
        var image = $('.profile-page #modalEditImgUser #imgPreview').attr('src')
        const id = e.target.dataset.user
        const query = {
            image
        }
        fetch(`./user/image/${id}`, {
            method:'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(query)
        }).then(res => res.text())
        .then(data => {
            data = JSON.parse(data)
            if (data.status) {
                let url = data.User.image

                $('.profile-page #user-main-social-network').attr('src', url)
                $('.messsageAlertPage #message-alert-show .content').html(data.message)
                $('.messsageAlertPage #message-alert-show').fadeIn();
    
                setTimeout(() => {
                    $('.messsageAlertPage #message-alert-show').fadeOut();
                },3000)

                $('.profile-page #modalEditImgUser').modal('hide')
                $('.preview-image-status-upload-modal-edit .fa-times').trigger('click')
            }
            else {
                $('.messsageAlertPage #message-alert-show .content').html(data.error)
                $('.messsageAlertPage #message-alert-show').fadeIn();
    
                setTimeout(() => {
                    $('.messsageAlertPage #message-alert-show').fadeOut();
                },3000)
            }
            $('.profile-page #modalEditImgUser #updateImgUserBtn .fa-spinner').hide()
        }).catch(e => {
            $('.profile-page #modalEditImgUser #updateImgUserBtn .fa-spinner').hide()
            $('.messsageAlertPage #message-alert-show .content').html(e.message)
            $('.messsageAlertPage #message-alert-show').fadeIn();

            setTimeout(() => {
                $('.messsageAlertPage #message-alert-show').fadeOut();
            },3000)
        })
    })
    // -------------------------------------------------------------------------------------------
    // Edit status infor
    $('.index-page #modalEditStatus #updateStatusByIdBtn').on('click', e => {
        $('.index-page #modalEditStatus #updateStatusByIdBtn .fa-spinner').show()
        var status = $('.index-page #modalEditStatus').attr('data-status')
        var statusTitle = $('.index-page #modalEditStatus #statusTitleEditStatus').val()
        var image = $('.index-page #modalEditStatus #imgPreview').attr('src')
        var video = $('.index-page #modalEditStatus #youtubeUrlEditStatus').val()
        
        const query = {
            statusTitle: statusTitle,
            image: image,
            video: video
        }
        fetch(`./status/${status}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(query)
        }).then(res => res.text())
        .then(data => {
            data = JSON.parse(data)
            let imgString = ''
            let videoString = ''
            let status = data.Status
            if (data.status) {
                $('.index-page #modalEditStatus #updateStatusByIdBtn .fa-spinner').hide()
                $('.messsageAlertPage #message-alert-show .content').html(data.message)
                $('.messsageAlertPage #message-alert-show').fadeIn();
                
                $(`.index-page .card-${status._id} .content-status`).html(status.statusTitle)

                if (status.image) {
                    imgString = `<img src="${status.image}" alt="" class="img-fluid">`
                }
                if (status.video) {
                    videoString = `
                        <iframe
                            src="${status.video}" height="450" frameborder="0">
                        </iframe>
                    `
                }

                $(`.index-page .card-${status._id} .ajax-image-status`).html(imgString)
                $(`.index-page .card-${status._id} .ajax-video-status`).html(videoString)

                setTimeout(() => {
                    $('.messsageAlertPage #message-alert-show').fadeOut();
                },2000)

                $('.index-page #modalEditStatus').modal('hide')
            }
            else {
                $('.index-page #modalEditStatus #updateStatusByIdBtn .fa-spinner').hide()
                $('.messsageAlertPage #message-alert-show .content').html(data.error)
                $('.messsageAlertPage #message-alert-show').fadeIn();
    
                setTimeout(() => {
                    $('.messsageAlertPage #message-alert-show').fadeOut();
                },3000)
            }
        }).catch(e => {
                $('.index-page #modalEditStatus #updateStatusByIdBtn .fa-spinner').hide()
                $('.messsageAlertPage #message-alert-show .content').html(e.message)
                $('.messsageAlertPage #message-alert-show').fadeIn();
    
                setTimeout(() => {
                    $('.messsageAlertPage #message-alert-show').fadeOut();
                },3000)
        })
    })
    // -------------------------------------------------------------------------------------------
    // Scroll load status
    if ($(".index-page")[0]) {
        $(window).on("scroll",async () => {
            var scrollHeight = $(document).height();
            var scrollPosition = $(window).height() + $(window).scrollTop();
            const statusLengthInPage = $('.index-page .multi-card .card').length
            const checkLengthInPage = document.querySelector('.index-page .multi-card').dataset.length_status
            // console.log("check status length:",checkLengthInPage)
            // console.log("check status trên view:",statusLengthInPage)
            // console.log(scrollPosition)
            // console.log(scrollHeight)
            if (parseInt(statusLengthInPage) !== parseInt(checkLengthInPage)) {
                if (scrollHeight - scrollPosition < 2) {
                    $('.index-page .gap2 .container .row .loader').show()
                    $(".index-page .multi-card").attr("data-length_status",statusLengthInPage)
    
                    // console.log('Số status có trên view:',statusLengthInPage)
                    console.log("dang scroll............... STATUS")
                    fetch(window.parent.location.origin + `/status/page/${statusLengthInPage}`, {
                        method: 'GET'
                    })
                    .then(res => res.json())
                    .then(async json => {
                        if (json.success) {
                            if (json.Status.length === 0) {
                                $('.index-page .gap2 .container .row .loader').hide()
                            }
                            else {
                                data = ""
        
                                // user login
                                const pageIndex = document.querySelector('.index-page')
                                userId = pageIndex.dataset.userid
                                image = pageIndex.dataset.image
                                fullName = pageIndex.dataset.name
                                var user = {
                                    userId: userId,
                                    image: image,
                                    fullName: fullName
                                }
                                // console.log("user: ",user)
                                var checkLike = false
                                await json.Status.forEach(async status => {
                                    author = status.user
                                    // console.log(status)
                                    let stringUserLike = ""
                                    if (!status.like) {
                                        status.like = []
                                        checkLike = false
                                    }
                                    else {
                                        status.like = JSON.parse(status.like)
                                        status.like.forEach(l => {
                                            if (user.userId == l._id) {
                                                checkLike = true
                                            }
        
                                            stringUserLike += `
                                            <div class="cardShowUserLike">
                                                <img src="${l.image}" alt="" class="showUserLikeImg">
                                                <span class="nameUserLike">${l.name}</span>
                                            </div>
                                            `
                                        });
                                        status.checkLike = checkLike
                                        // gắn lại giá trị default cho biến checkLike để sử dụng cho element vòng lặp kế tiếp
                                        checkLike = false
                                    }
                                    var likeString = ""
                                    if (status.checkLike) {
                                        likeString =
                                        `<div class="like liked ${status._id}" onclick="getLikeStatus(this)" data-id="${status._id}">
                                            <i class="fa fa-thumbs-up"></i> <span>Thích</span>
                                        </div>`
                                    }
                                    else {
                                        likeString =
                                        `<div class="like ${status._id}" onclick="getLikeStatus(this)" data-id="${status._id}">
                                            <i class="fa fa-thumbs-up"></i> <span>Thích</span>
                                        </div>`
                                    }

                                    let iframe = ""
                                    if (status.video != undefined || status.video != null) {
                                        iframe = `
                                            <iframe
                                                src="${status.video}" height="450" frameborder="0">
                                            </iframe>
                                        `
                                    }
        
                                    data +=
                                    `
                                    <div class="modal fade showUserLikeModal" id="showUserLikeModal${status._id}">
                                        <div class="modal-dialog">
                                            <div class="modal-content">
                                                <!-- Modal Header -->
                                                <div class="modal-header">
                                                    <h4 class="modal-title">Số người thích bài viết</h4>
                                                </div>
                                                <!-- Modal body -->
                                                <div class="modal-body listCardUserLike">
                                                    ${stringUserLike}
                                                </div>
                                                <!-- Modal footer -->
                                                <div class="modal-footer">
                                                    <button type="button" class="btn btn-success" data-dismiss="modal">Close</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
        
                                    <div class="card card-${status._id}">
                                        <!--Information of post's user-->
                                        <div class="d-flex justify-content-between p-2 px-2">
                                            <div class="d-flex flex-row align-items-center">
                                                <a href="./profile?id=${author._id}"><img src="${author.image}" alt="" class="image-user rounded-circle" width="52"></a>
                                                <div class="d-flex flex-column ml-2">
                                                    <span class="font-weight-bold">${author.name}</span>
                                                    <small class="text-primary">Thông tin</small>
                                                </div>
                                            </div>
                                            <!--Time and more-->
                                            <div class="time-and-more d-flex flex-row mt-2" data-user=${author._id} data-status="${status._id}" onclick="editStatus(this)">
                                            <small class="mr-2">${getPassedTime(new Date(status.dateModified),Date.now())}</small><i class="fas fa-ellipsis-v"></i>
                                            </div>
                                        </div>
                                        <!--Area of post-->
                                        <!-- dropdown edit status -->
                                            <div class="dropdown-edit-status">
                                                <div class="dropdowns">
                                                    <ul>
                                                        <li data-toggle="modal" data-target="#modalEditStatus" data-status="${ status._id }" onclick="liEditStatus(this)">
                                                            Chỉnh sửa <i class="fas fa-edit"></i>
                                                        </li>
                                                        <li data-toggle="modal" data-target="#modalDeleteStatus" data-status="${ status._id }" onclick="liDeleteStatus(this)">
                                                            Xoá <i class="far fa-trash-alt"></i>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        <p class="text-justify ml-3 content-status">${ status.statusTitle }</p>
                                        <div class="ajax-video-status">
                                            ${iframe}
                                        </div>
                                        <div class="ajax-image-status">
                                            <img src="${ status.image }" alt="" class="img-fluid">
                                        </div>
                                        <!-- Number of Comment and Interactive-->
                                        <div class="d-flex justify-content-between align-items-centerl">
                                            <div class="d-flex flex-row icons d-flex align-items-center ml-3 interactive_color">
                                                
                                                <span><i class="fa fa-thumbs-up"></i> 
                                                    <span class="view-like-user view-${status._id}" title="Số người thích bài viết" href="#" data-status="${status._id}" onclick="showModalUserLike(this)">
                                                        ${status.like.length}
                                                    </span>
                                                </span>
                                            </div>
                                            <div class="d-flex flex-row interactive_color m-3">
                                                <span class="mr-3 cmt">Bình luận</span>
                                                <span class="shares">Chia sẻ</span>
                                            </div>
                                        </div>
                                        <hr>
                                        <!--Interative-->
                                        <div class="d-flex justify-content-between align-items-centerl mx-5">
            
                                            ${likeString}
            
                                            <div class="cmts"  onclick="showHideComments(this)" data-status="${status._id}">
                                                <i class="fa fa-comments"></i> <span>Bình luận</span>
                                            </div>
                                            <div class="shr">
                                                <i class="fa fa-share-square"></i> <span>Chia sẻ</span>
                                            </div>
                                        </div>
                                        <hr>
                                        <!--Comment-->
                                        <div class="comments mx-3 comments${status._id}">
                                            <div class="comment-input">
                                                <input type="text" class="form-control" id="text-content-comment${status._id}">
                                                <div class="fonts send-comment" data-author="${user.userId}" data-status = "${status._id}" onclick="fetchApiComment(this)">
                                                    <i class="fas fa-paper-plane"></i>
                                                </div>
                                            </div>
        
                                            <div class="card-comments-user card-comments-user${status._id}">
                                            </div>
        
                                            <div class="spinner-border check-loading-preview-${status._id}"></div>
                                            <div class="notification-preview-comments notification-preview-comments-${status._id}">
                                                Không còn bài viết nào
                                            </div>
                                            <div class="preview-comments-before" onclick="showCommentsStatus(this)" data-status = "${status._id}">
                                                Xem thêm bình luận
                                            </div>
                                            <div class="focus-btn-post-comment" onclick="focusPostBtnComment(this)" data-status = "${status._id}">
                                                Viết bình luận của bạn...
                                            </div>
                                        </div>
                                    </div>`
        
                                    // ĐANG BỊ LỖI CẦN SỬA ------------------------------------------------------------
                                    let arrayCardStringComment = await fetch(`${window.parent.location.origin}/comment/status/${status._id}/0`, {
                                        method:'GET'
                                    })
                                    .then(res => res.text())
                                    .then(async dataLike => {
                                        const dataLikeParse = JSON.parse(dataLike)
                                        // console.log(dataLikeParse)
                                        if (dataLikeParse.success) {
                                            let arrayCardString = ''
                                            let arrayCardComment = dataLikeParse.Comment.map(async comment => {
                                                // console.log(comment.statusId)
                                                let cardStringComment = await fetch(`${window.parent.location.origin}/user/${comment.author}`, {
                                                    method:'GET'
                                                })
                                                .then(res => res.text())
                                                .then(dataAuthorComment => {
                                                    dataAuthorComment = JSON.parse(dataAuthorComment)
                                                    if (dataAuthorComment.success) {
                                                        // console.log(dataAuthorComment)
                                                        let cardStringComment = `
                                                        <div class="d-flex flex-row mb-2">
                                                            <a href="./profile?id=${comment.author}">
                                                                <img src="${dataAuthorComment.user.image}" width="40" class="round-img">
                                                            </a>
                                                            <div class="d-flex flex-column ml-2">
                                                                <span class="nameOfUser">${dataAuthorComment.user.name}</span>
                                                                <small class="comment-text">${comment.content}</small>
                                                                <div
                                                                    class="d-flex flex-row align-items-center interactive_comment_color">
                                                                    <small>Thích</small>
                                                                    <small>Trả lời</small>
                                                                    <small>Dịch</small>
                                                                    <small>${getPassedTime(new Date(comment.dateModified),Date.now())}</small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        `
                                                        return cardStringComment
                                                    }
                                                }).catch(e => console.log(e))
        
                                                return cardStringComment
                                            });
                                            let arrayCardStringComment = ""
                                            let temp = await Promise.all(arrayCardComment)
                                            temp.forEach(e => {
                                                arrayCardStringComment += e
                                            });
                                            return arrayCardStringComment
                                        }
                                    }).catch(e => console.log(e))
        
                                    // console.log(arrayCardStringComment)
                                    // ĐANG BỊ LỖI CẦN SỬA ------------------------------------------------------------
                                    // thêm card string vào cho thẻ card-comments-user
                                    $(`.index-page .comments${status._id} .card-comments-user`).append(arrayCardStringComment)
                                });
            
                                $(".index-page .multi-card").append(data)
                            }
                        }
                    }).catch(e => console.log(e))
                }
            }
            else {
                // console.log("data không được đổ lên -> số status trên view:",statusLengthInPage)
            }
    
        });
    }

    // -------------------------------------------------------------------------------------------
    //dashboardDepartment
    $(".dashboardDepartment .row img ").each(function (k, v) {
        v.onload = function () {
            $(this).parent().children('.loading').attr('display', 'none')
            $(this).parent().children('.loading').removeClass('d-flex')
            $(this).addClass('show-image')
        };
        v.onerror = () => {
            $(this).parent().children('.loading').attr('display', 'none')
            $(this).parent().children('.loading').removeClass('d-flex')
            $(this).addClass('show-image')
        }
        v.src = v.src;
    });
    if ($(".notificationPage")[0]) {
        var data = []
        let indexPage=1
        let numberPage = 1
        function displayNotification(data){
            if(data.length ===0){
                $(".list-notification").children().remove()
                return
            } 
            let tempData = [...data]

            if(!isNaN(tempData[0].createAt)){
                tempData.forEach(e =>{
                    let d = new Date(e.createAt);
                    e.createAt = d.toJSON().slice(0,10).split('-').reverse().join('-')
                })
            }
            
            let stringdata = ''
            tempData.forEach(item =>{

                stringdata +=`
                    <li class="list-group-item">
                        <h4 class="title" >${item.title}</h4>
                        <div class="content">
                            <a href="/notification/${item.department}/${item._id}">Chi tiết thông báo</a>
                        </div>
                        <p class="font-italic">[${item.author }] - ${item.createAt}</p>
                    </li>
                `
            })
            let size =$(".background-masker").parent().parent().length
            let count = 1
            $(".background-masker").parent().parent().fadeTo("slow" , 0.7,function() {
                $(this).remove();
                
                if(count ===size ){
                    $(".list-notification").children().remove()
                    $(".list-notification").append(stringdata)
                    count = 1 
                }
                count +=1
            })

        }
        function splitArrayIntoChunksOfLen(arr1, len) {
            let arr = [...arr1]
            var chunks = [], i = 0, n = arr.length;
            while (i < n) {
                chunks.push(arr.slice(i, i += len));
            }
            return chunks;
        }
        function displayPagination(count){
            let pagination = Math.ceil(count/10)
            numberPage = pagination
            let stringPagination=`<li class="page-item previous disabled">
                                    <button class="page-link" tabindex="-1">Previous</button>
                                </li>`
            for(let i = 1;i<= pagination;i++){
                
                if(i == 1){
                    stringPagination += `<li class="page-item active"><button class="page-link numpage" value=${i} >${i}</button></li>`
                }else{
                    stringPagination += `<li class="page-item"><button class="page-link numpage" value=${i} >${i}</button></li>`
                }
            }
            stringPagination+=`<li class="page-item next">
                                    <button class="page-link" >Next</button>
                                </li>`
            $(".notificationPage .pagination").children().remove()
            if(pagination ===0) return 
            $(".notificationPage .pagination").append(stringPagination)
            if(1===pagination){
                $(".page-item.next").addClass("disabled")
            }
            $(".numpage").click( async e =>{
                $(".notificationPage .page-item button").addClass("disabledbutton")
                $(".page-item.next").addClass("disabled")
                $(".page-item.previous").addClass("disabled")
                indexPage = parseInt(e.target.value)
           

                $.when( $(".list-notification").children().remove()).done(async function() {
                    $(".list-notification").append(` <li class="list-group-item ">
                            <div class="animated-background">
                                <a class="background-masker font-weight-bold " href="#"></a>
                                <p class="background-masker head"></p>
                                <div class="background-masker content">
                                </div>
                                <p class="background-masker body"></p>
                            </div>
                    </li>`.repeat(7))
                    //page cu~
                    $('.page-item.active').children().prop('disabled', false);
                    $(".page-item.active").removeClass("active")
    
                    //page moi
                    e.target.parentNode.classList.add("active")
                    $('.page-item.active').children().prop('disabled', true);

                        
                    let [data, count] =await fetchDataNotification(indexPage)
                    displayNotification(data)

                    $(".notificationPage .page-item button").removeClass("disabledbutton")
                    $(".notificationPage .page-item").removeClass("disabled")
                    
                    if(indexPage === numberPage){
                        $('.page-item.next').addClass("disabled")
                    }else{
                        $('.page-item.next').removeClass("disabled")
                    }

                    if(indexPage === 1){
                        $('.page-item.previous').addClass("disabled")
                    }else{
                        $('.page-item.previous').removeClass("disabled")
                    }
                });
                

            })
            $('.page-item.previous').click(()=>{
                if($(".page-item.previous").hasClass("disabled")) return 
                
                if(indexPage === 1)return 
                indexPage -= 1
                $(`.page-item button[value=${indexPage}]`).click()                
            })
            $('.page-item.next').click(()=>{
                if($(".page-item.next").hasClass("disabled")) return 
                if(indexPage === numberPage)return 
                indexPage += 1
                $(`.page-item button[value=${indexPage}]`).click()                
            })
        }
        async function fectchDataWithParam(numpage, maphong, unread, start, end){
            let url_getNotification = new URL(window.parent.location.origin+'/api/notification')
            let params = {page:numpage,maphong:maphong, unread: unread, start:start, end:end}
            url_getNotification.search = new URLSearchParams(params).toString();
            const getFilterNotification = await fetch(url_getNotification, {
                method: "GET",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            let data_notification = await getFilterNotification.json();
            data = data_notification.data
            return [data, data_notification.count]
        }
        async function fetchDataNotification(numpage){
            const phongban =  $('#selectDepartment option:selected').val()
            const unread = $("#unread").is(":checked")

            const beginDatepicker = moment(`${$("#beginDatepicker").val()} 00:00:00`, "DD-MM>-YYYY hh:mm:ss").valueOf()  || 0
            const endDatepicker = moment.utc(`${$("#endDatepicker").val()} 23:59:59`, "DD-MM-YYYY hh:mm:ss").valueOf()  || Date.now()
            //moment
            let result = await fectchDataWithParam(numpage, phongban, unread, beginDatepicker, endDatepicker)
            
            return result
        }

        try {
            
            let maphong = $('#selectDepartment option:selected').val()

            const result = await fetch(window.parent.location.origin+"/api/notification?maphong="+maphong, {
                method: "GET",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            
            data = await result.json();
            displayPagination(data.count)
            data = data.data
            displayNotification(data)
            
        } catch (error) {
            console.log(error)
            $(".background-masker").parent().parent().fadeOut( function() { $(this).remove(); })
        }
       
        let startTimePicker = $('#beginDatepicker').datepicker({
            uiLibrary: 'bootstrap4',
            format: 'dd-mm-yyyy' 
        });
        let endTimePicker =$('#endDatepicker').datepicker({
            uiLibrary: 'bootstrap4',
            format: 'dd-mm-yyyy' 
        });

        $(".notificationPage #form_filter").submit(async e=>{
            e.preventDefault()
            $(".list-notification")
            $(".list-notification").children().remove()
            $(".list-notification").append(` <li class="list-group-item ">
                    <div class="animated-background">
                        <a class="background-masker font-weight-bold " href="#"></a>
                        <p class="background-masker head"></p>
                        <div class="background-masker content">
                        </div>
                        <p class="background-masker body"></p>
                    </div>
            </li>`.repeat(7))
            indexPage = 1
            let [data, count] =await fetchDataNotification(1)
            displayNotification(data)
            displayPagination(count)
        })

        
        if($(".notificationPage #editor")[0]){
            $(document).on('focusin', function (e) {
                if ($(e.target).closest(".tox-dialog").length) {
                    e.stopImmediatePropagation();
                }
            });
            tinymce.init({
                selector: '#editor',
                height: 400,
                plugins: 'advlist autolink lists link image charmap print preview hr anchor pagebreak',
                toolbar_mode: 'floating',
                plugins: [
                    'advlist autolink link image lists charmap print preview hr anchor pagebreak',
                    'searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking',
                    'table emoticons template paste help'
                ],
                toolbar: 'undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | ' +
                'bullist numlist outdent indent | link image | print preview media fullpage | ' +
                'forecolor backcolor emoticons | help',
                menu: {
                    favs: {title: 'My Favorites', items: 'code visualaid | searchreplace | emoticons'}
                },
                menubar: 'favs file edit view insert format tools table help',
            });
            
            $(".post_notification_button").click(e=>{
                e.preventDefault()
                let title = $("#titleNotification").val()
                let content = tinyMCE.activeEditor.getContent({format : 'raw'})
                let department =$("#formAddNotification").data('url');
                console.log(title, content, department)
                try {
                    $.post( "/api/notification",{title:title, content:content, department:department}, function( data, status ) {
                        console.log(data)
                    if(data.data){
                        $("#formAddNotification input").val("")
                        tinyMCE.activeEditor.setContent('');
                        $(".messageAddNotification").addClass('text-success').removeClass('text-danger').text("Thêm thông báo thành công ")
                    }else{

                        let errmessage = data.message.msg || data.message
                        $(".messageAddNotification").addClass('text-danger').removeClass('text-success').text("Thêm thông báo thất bại: "+ errmessage)
                    }
                });
                } catch (error) {
                    console.log(error)
                    $(".messageAddNotification").addClass('text-danger').removeClass('text-success').text("Thêm thông báo thất bại")
                }
                
            })
        }
    }
});

const getPassedTime = (startTime, endTime) => {
    let passTime = Math.floor((endTime - startTime) / 1000)
    let outputTime = ""
    if (passTime < 60)
        outputTime = passTime + " giây trước"
    else if (passTime < (60 * 60))
        outputTime = Math.floor(passTime / 60) + " phút trước"
    else if (passTime < (60 * 60 * 24))
        outputTime = Math.floor(passTime / (60 * 60)) + " giờ trước"
    else if (passTime < (60 * 60 * 24 * 30))
        outputTime = Math.floor(passTime / (60 * 60 * 24)) + " ngày trước"
    else if (passTime < (60 * 60 * 24 * 30 *365))
        outputTime = Math.floor(passTime / (60 * 60 * 24 * 30)) + " tháng trước"
    return outputTime
}

if($(".index-page")[0]){

    var myVar = setInterval(myTimer, 60000);

    function myTimer() {
        let a= $('.vertical-timeline-element-content .vertical-timeline-element-date');
        
        $.each(a,(i,item)=>{
            item.innerHTML = getPassedTime(parseInt(item.dataset.time),Date.now())
        })
    }
    
    let page =1
    $(".loading").show()
    fetch('/api/notification', {
        method: 'GET', // or 'PUT'
    })
    .then(response => response.json())
    .then(data => {
        $(".loading").hide()
        
        for(let i of data.data){
            $(".vertical-timeline").append(`
                <div class="vertical-timeline-item vertical-timeline-element">
                    <div>
                        <span class="vertical-timeline-element-icon bounce-in">
                            <i class="far fa-dot-circle"></i>
                        </span>
                        <div class="vertical-timeline-element-content bounce-in">
                            <h4 class="timeline-title">${i.author}</h4>
                            <p>${i.title}</p>
                            <a href="/notification/${i.department}/${i._id}">Xem chi tiết</a>
                            <span class="vertical-timeline-element-date" data-time=${i.createAt}>${getPassedTime(i.createAt,Date.now())}</span>
                        </div>
                    </div>
                </div>
            `)
        }
        $('.vertical-timeline').append($('.spinerLoadingNotification'))
        $('.spinerLoadingNotification').hide()
        

    })
    .catch((error) => {
        $(".loading").hide()
        $('.spinerLoadingNotification').hide()
        console.log('Error:', error);
    });
    $(".notification-body").scroll(function () {
        // console.log($('.notification-body')[0].scrollHeight - $('.main-card').height())
        // console.log($(".notification-body").scrollTop())
        if($('.notification-body')[0].scrollHeight - $('.main-card').height() - $(".notification-body").scrollTop() < 1) {
            console.log(`Loading.... Notification`);
            $(".spinerLoadingNotification .spinner-border").show();
            $(".spinerLoadingNotification p").hide()
            $('.vertical-timeline').append($('.spinerLoadingNotification'))
            $('.spinerLoadingNotification').show()
            page +=1
            fetch('/api/notification?page='+page, {
                method: 'GET', // or 'PUT'
            })
            .then(response => response.json())
                .then(data => {
                if(data.data.length ===0){
                    $(".spinerLoadingNotification .spinner-border").hide();
                    $(".spinerLoadingNotification p").show()
                    return 
                }
                $(".spinerLoadingNotification").hide()
                let stringdata =''
                for(let i of data.data){
                    stringdata +=`
                        <div class="vertical-timeline-item vertical-timeline-element">
                            <div>
                                <span class="vertical-timeline-element-icon bounce-in">
                                    <i class="far fa-dot-circle"></i>
                                </span>
                                <div class="vertical-timeline-element-content bounce-in">
                                    <h4 class="timeline-title">${i.author}</h4>
                                    <p>${i.title}</p>
                                    <a href="/notification/${i.department}/${i._id}">Xem chi tiết</a>
                                    <span class="vertical-timeline-element-date" data-time=${i.createAt}>${getPassedTime(i.createAt,Date.now())}</span>
                                </div>
                            </div>
                        </div>
                    `
                }
                $(".vertical-timeline").append(stringdata)
                $('.vertical-timeline').append($('.spinerLoadingNotification'))
                $(".spinerLoadingNotification").hide()
        
            })
            .catch((error) => {
                $('.vertical-timeline').append($('.spinerLoadingNotification'))
                $(".spinerLoadingNotification").hide()
                console.log('Error:', error);
            });
        }
    });
     $( ".index-page textarea.statusTitle" ).keyup(function() {
        if ($('.index-page textarea.statusTitle').val().length !== 0) {
            $('.index-page .post-btn').prop('disabled', false)
            $('.index-page .post-btn').css('cursor', 'pointer')
        }
        else {
            $('.index-page .post-btn').prop('disabled', true)
            $('.index-page .post-btn').css('cursor', 'no-drop')
        }
    });
    if ($('.index-page textarea.statusTitle').val().length === 0) {
        $('.index-page .post-btn').prop('disabled', true)
        $('.index-page .post-btn').css('cursor', 'no-drop')
    }
    // -------------------------------------------------------------------------------------------
    // tinyMCE
    // tinymce.init({
    //     height: "350",
    //     selector: '.index-page textarea.statusTitle',
    //     plugins: 'autoresize lists code emoticons media mediaembed pageembed paste powerpaste',
    //     toolbar: 'undo redo | styleselect | bold italic | ' +
    //         'alignleft aligncenter alignright alignjustify | ' +
    //         'outdent indent | numlist bullist | emoticons',
    //     emoticons_append: {
    //         custom_mind_explode: {
    //             keywords: ['brain', 'mind', 'explode', 'blown'],
    //             char: '🤯'
    //         }
    //     },
    //     autoresize_max_height: 500,
    //     tinycomments_mode: 'embedded',
    //     tinycomments_author: 'Author name',
    //     inline_boundaries: false,
    // });
    // -------------------------------------------------------------------------------------------
    // fetch api - status
    // ------------------------------------------------------------------------
    $(".index-page .post-btn").click(e => {
        $('.index-page .view-btn-add-new-status').hide()
        $('.index-page .spinner-border-btn-add-status').css('display', 'inline-block')
        var statusTitle = $('.index-page textarea.statusTitle').val()
        var base64Img = $('#output').attr('src')
        var urlYoutube = $('.index-page .attachments .input-link-youtube #urlYoutubeUpload').val()

        const image = document.querySelector('.index-page').dataset.image
        const userId = document.querySelector('.index-page').dataset.userid
        const fullName = document.querySelector('.index-page').dataset.name

        if (statusTitle.length !== 0) {
            let query = {
                imageStatus : base64Img,
                statusTitle : statusTitle,
                urlYoutube: urlYoutube
            }
            uploadImage(query)
        }
        function uploadImage(query) {
           fetch(window.parent.location.origin, { // Your POST endpoint
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(query)
                })
                .then(res => res.json())
                .then(json => {
                    if (json.success) {
                        author = json.Status.user
                        if (json.Status.like) {
                            like = JSON.parse(json.Status.like)
                        }
                        else{
                            like = 0
                        }
                        let iframe = ""
                        if (json.Status.video != undefined || json.Status.video != null) {
                            $('.index-page #youtubeVideoUpload').trigger('click')
                            iframe = `
                                <iframe
                                    src="${json.Status.video}" height="450" frameborder="0">
                                </iframe>
                            `
                        }
                        var htmlString =
                        `<div class="card card-${json.Status._id}">
                            <!--Information of post's user-->
                            <div class="d-flex justify-content-between p-2 px-2">
                                <div class="d-flex flex-row align-items-center">
                                    <a href="./profile?id=${author._id}"><img src="${author.image}" alt="" class="image-user rounded-circle" width="52"></a>
                                    <div class="d-flex flex-column ml-2">
                                        <span class="font-weight-bold">${author.name}</span>
                                        <small class="text-primary">Thông tin</small>
                                    </div>
                                </div>
                                <!--Time and more-->
                                <div class="time-and-more d-flex flex-row mt-2" onclick="editStatus(this)" data-user= "${author._id}" data-status="${json.Status._id}">
                                    <small class="mr-2">
                                    ${json.Status.currentTime}
                                    </small>
                                    <i class="fas fa-ellipsis-v"></i>
                                </div>
                            </div>
                            <!--Area of post-->
                            <!-- dropdown edit status -->
                            <div class="dropdown-edit-status">
                                <div class="dropdowns">
                                    <ul>
                                        <li data-toggle="modal" data-target="#modalEditStatus" data-status="${ json.Status._id }" onclick="liEditStatus(this)">
                                            Chỉnh sửa <i class="fas fa-edit"></i>
                                        </li>
                                        <li data-toggle="modal" data-target="#modalDeleteStatus" data-status="${ json.Status._id }" onclick="liDeleteStatus(this)">
                                            Xoá <i class="far fa-trash-alt"></i>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <p class="text-justify ml-3 content-status">${ json.Status.statusTitle }</p>
                            <div class="ajax-video-status">
                                ${iframe}
                            </div>
                            <div class="ajax-image-status">
                                <img src="${ json.Status.image }" alt="" class="img-fluid">
                            </div>
                            <!-- Number of Comment and Interactive-->
                            <div class="d-flex justify-content-between align-items-centerl">
                                <div class="d-flex flex-row icons d-flex align-items-center ml-3 interactive_color">
                                    <span>
                                        <i class="fa fa-thumbs-up"></i>
                                        <span class="view-like-user view-${json.Status._id}" title="Số người thích bài viết" href="#" data-status="${json.Status._id}" onclick="showModalUserLike(this)">
                                            ${like}
                                        </span>
                                    </span>
                                </div>
                                <div class="d-flex flex-row interactive_color m-3">
                                    <span class="mr-3 cmt">Bình luận</span>
                                    <span class="shares">Chia sẻ</span>
                                </div>
                            </div>
                            <hr>
                            <!--Interative-->
                            <div class="d-flex justify-content-between align-items-centerl mx-5">
                                <div class="like ${json.Status._id}" onclick="getLikeStatus(this)" data-id="${json.Status._id}">
                                    <i class="fa fa-thumbs-up"></i> <span>Thích</span>
                                </div>
                                <div class="cmts" onclick="showHideComments(this)" data-status="${json.Status._id}">
                                    <i class="fa fa-comments"></i> <span>Bình luận</span>
                                </div>
                                <div class="shr">
                                    <i class="fa fa-share-square"></i> <span>Chia sẻ</span>
                                </div>
                            </div>
                            <hr>
                            <!--Comment-->
                            <div class="comments mx-3 comments${json.Status._id}">
                                <div class="comment-input">
                                    <input type="text" class="form-control" id="text-content-comment${json.Status._id}">
                                    <div class="fonts send-comment" data-author="${author._id}" data-status = "${json.Status._id}" onclick="fetchApiComment(this)">
                                        <i class="fas fa-paper-plane"></i>
                                    </div>
                                </div>

                                <div class="card-comments-user">
                                </div>
                                <div class="spinner-border check-loading-preview-${json.Status._id}"></div>
                                <div class="notification-preview-comments notification-preview-comments-${json.Status._id}">
                                    Không còn bài viết nào
                                </div>
                                <div class="preview-comments-before" onclick="showCommentsStatus(this)" data-page="1" data-status = "${json.Status._id}">
                                    Xem thêm bình luận
                                </div>
                                <div class="focus-btn-post-comment" onclick="focusPostBtnComment(this)" data-status = "${json.Status._id}">
                                    Viết bình luận của bạn...
                                </div>
                            </div>
                        </div>`
                        // console.log(htmlString)
                        $(".index-page .multi-card").prepend(htmlString)
                        

                        // set null in content and image upload = null
                        if (base64Img !== undefined) {
                            $('.index-page .image-upload-preview .close-icon').trigger('click');
                        }
                        $('.index-page textarea.statusTitle').val("");
                        $('.index-page .attachments .input-link-youtube #urlYoutubeUpload').val("")

                        if (json.Status.video != undefined) {
                            $('.index-page .attachments .input-link-youtube').trigger('click');
                        }

                        $('.index-page .post-btn').prop('disabled', true)
                        $('.index-page .post-btn').css('cursor', 'no-drop')
                        $('.index-page .spinner-border-btn-add-status').css('display', 'none');
                        $('.index-page .view-btn-add-new-status').show()
                    }
                })
                .catch(e => console.log(e))
        }
    });

}



if ($(".addDepartment")[0]) {
    $.ajaxSetup({
        traditional: true,
    });
    var uppyDepartment = Uppy.Core({
        restrictions: {
            maxFileSize: 3145728,
            maxNumberOfFiles: 1,
            minNumberOfFiles: 1,
            allowedFileTypes: ["image/*"],
        },
    }).use(Uppy.Dashboard, {
        trigger: "#register",
        inline: true,
        target: "#drag-drop-area",
        replaceTargetContent: true,
        showProgressDetails: true,
        note: "Images and video only 1 file, up to 3MB",
        height: 300,
        metaFields: [
            {
                id: "caption",
                name: "Caption",
                placeholder: "describe what the image is about",
            },
        ],
        hideUploadButton: false,
    });

    uppyDepartment.on("file-added",async (file) => {
        uppyDepartment.setFileMeta(file.meta.id, {
            caption: file.name,
        });
    });
    uppyDepartment.use(Uppy.XHRUpload, {
        id: "XHRUpload",
        endpoint: `https://xhr-server.herokuapp.com/upload`,
        method: "POST",
        formData: true,
        fieldName: "my_fieldName",
        metaFields: ["caption"],
    });
    uppyDepartment.on("upload-success", (file, response) => {
        $(".addDepartment #urlImage").val(response.uploadURL);
        var formdata = new FormData();
        formdata.append("image", response.uploadURL);

        var requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow'
        };

        fetch("https://api.imgbb.com/1/upload?key=de5ac21fcec9e6b966d367c5aa7c9c17", requestOptions)
        .then(response => response.text())
        .then(result =>{
            result = JSON.parse(result)
            if(result.status == 200){
                $(".addDepartment #urlImage").val(result.data.display_url);
            }
        })
        .catch(error => console.log('error', error));

    });
    $(".addDepartment #register").click(function () {
        $(".addDepartment .register-form").submit();
    });
    $(".addDepartment .register-form").submit((e) => {
        e.preventDefault();
        let department = [];
        $(".addDepartment input:checkbox:checked").each(function () {
            department.push($(this).val());
        });
        let user = {
            username: $(".addDepartment #username").val(),
            pass: $(".addDepartment #pass").val(),
            re_pass: $(".addDepartment #re_pass").val(),
            name: $(".addDepartment #name").val(),
            maphong: $(".addDepartment #maphong").val(),
            urlImage: $(".addDepartment #urlImage").val(),
            department: department,
        };
        $.post("", user).done(function (res) {
            if (res.success) {
                $(".addDepartment .alert").removeClass("alert-danger");
                $(".addDepartment .alert").addClass("alert-success");
                $(".addDepartment .alert").text(res.mess);
                $(".addDepartment #myCollapsible").collapse("show");
                $(".addDepartment input").val("");
                uppyDepartment.reset();
            } else {
                $(".addDepartment .alert").removeClass("alert-success");
                $(".addDepartment .alert").addClass("alert-danger");
                $(".addDepartment .alert").text(res.mess);
                $(".addDepartment #myCollapsible").collapse("show");
            }
        });
        $(".addDepartment input").on("keypress change ", () => {
            $(".addDepartment #myCollapsible").collapse("hide");
        });
    });
}

 


// -------------------------------------------------------------------------------------------- //
// Initialize the map
    // [50, -0.1] are the latitude and longitude
    // 4 is the zoom
    // mapid is the id of the div where the map will appear
    var mymap = L
        .map('mapid')
        .setView([30.16, 122.12], 8);

    // Add a tile to the map = a background. Comes from OpenStreetmap
    L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
            maxZoom: 15,
        }).addTo(mymap);

    // 从后端获取渔船数据
    function getshipdata() {
        $.ajax({
            url: './mapid',
            method: 'GET',
            success: function (response) {
                // 成功获取数据后的处理
                handleShipData(response);
            },
            error: function (error) {
                console.error('Failed to fetch ship data:', error);
            }
        });
    }

    // 处理从后端获取的渔船数据
    function handleShipData(data) {
        var fishingBoatsData = [];
        for (var i = 0; i < data.length; i++) {
            var tuple = data[i];
            var boat = {
                id: tuple[0],
                x: tuple[1],
                y: tuple[2],
                speed: tuple[3],
                direction: tuple[4],
                time: tuple[5],
                type: tuple[6]
            };
            fishingBoatsData.push(boat);
        }

        // 调用绘制渔船数据的函数
        drawFishingBoats(fishingBoatsData);
    }

    // 绘制渔船数据
    function drawFishingBoats(data) {
        // 定义颜色映射表
        var colorMap = {
            '1': 'red',
            '2': 'blue',
            '12281': 'green',
            // 添加更多ID和对应颜色...
        };
        for (var i = 0; i < data.length; i++) {
            var boat = data[i];

            var radius = 10; // 根据速度等信息进行调整


            // 根据渔船ID选择颜色
            var color = colorMap[boat.id] || 'gray'; // 默认为灰色

            L.circle([boat.x, boat.y], {
                color: color,
                fillColor: color,
                fillOpacity: 0.5,
                radius: radius
            }).addTo(mymap)
                .bindPopup('<b>ID:</b> ' + boat.id + '<br><b>速度:</b> ' + boat.speed + ' 节<br><b>方向:</b> ' + boat.direction + ' 度<br><b>时间:</b> ' + boat.time + '<br><b>类型:</b> ' + boat.type);
        }
    }

    // 调用获取渔船数据的函数
    getshipdata();
    let sidebar = document.querySelector(".sidebar");
    let sidebarBtn = document.querySelector(".navbar-menu");
    console.log(sidebarBtn);
    sidebarBtn.addEventListener("click", () => {
        sidebar.classList.toggle("close");
    });
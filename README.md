<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>গুগল লগইন ওয়েবসাইট</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            text-align: center;
            background-color: #f4f4f4;
        }
        header {
            background-color: #333;
            color: white;
            padding: 20px;
        }
        .content {
            padding: 50px;
        }
        #g_id_signin {
            margin: 20px auto;
        }
        #mining-section {
            display: none; /* লগইনের আগে মাইনিং বাটন লুকানো থাকবে */
            margin-top: 20px;
        }
        #mining-button {
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            border: none;
            cursor: pointer;
            font-size: 16px;
        }
        #mining-button:disabled {
            background-color: #cccccc;
            cursor: not-allowed;
        }
        #points-display, #mining-status {
            margin-top: 10px;
            font-size: 18px;
            color: #333;
        }
        footer {
            background-color: #333;
            color: white;
            padding: 10px;
            position: fixed;
            bottom: 0;
            width: 100%;
        }
    </style>
</head>
<body>
    <header>
        <h1>স্বাগতম আমার ওয়েবসাইটে</h1>
    </header>
    <div class="content">
        <h2>গুগল দিয়ে লগইন করুন</h2>
        <!-- গুগল লগইন বাটন -->
        <div id="g_id_onload"
             data-client_id="415991713212-o81pj4vjem5kni087uleiefq4vc686ml.apps.googleusercontent.com"
             data-callback="handleCredentialResponse"
             data-auto_prompt="false">
        </div>
        <div class="g_id_signin" data-type="standard" data-size="large"></div>
        <p id="user-info" style="display: none;">লগইন সফল! ব্যবহারকারীর তথ্য: <span id="user-name"></span></p>
        
        <!-- মাইনিং সেকশন -->
        <div id="mining-section">
            <button id="mining-button" onclick="startMining()">মাইনিং</button>
            <p id="points-display">আপনার পয়েন্ট: <span id="points">0</span></p>
            <p id="mining-status">মাইনিং স্ট্যাটাস: <span id="status-text">প্রস্তুত</span></p>
        </div>
    </div>
    <footer>
        <p>© 2025 আমার ওয়েবসাইট। সর্বস্বত্ব সংরক্ষিত।</p>
    </footer>

    <!-- গুগল API স্ক্রিপ্ট -->
    <script src="https://accounts.google.com/gsi/client" async defer></script>
    <script>
        let userPoints = localStorage.getItem("userPoints") ? parseInt(localStorage.getItem("userPoints")) : 0;
        let lastMiningTime = localStorage.getItem("lastMiningTime") ? parseInt(localStorage.getItem("lastMiningTime")) : 0;
        const miningCooldown = 24 * 60 * 60 * 1000; // ২৪ ঘণ্টা মিলিসেকেন্ডে

        // পয়েন্ট এবং স্ট্যাটাস ইনিশিয়ালাইজ করা
        document.getElementById("points").innerText = userPoints;
        updateMiningStatus();

        function handleCredentialResponse(response) {
            const data = jwt_decode(response.credential);
            document.getElementById("user-info").style.display = "block";
            document.getElementById("user-name").innerText = data.name + " (" + data.email + ")";
            document.getElementById("mining-section").style.display = "block";
            updateMiningStatus();
        }

        // JWT ডিকোড করার জন্য ফাংশন
        function jwt_decode(token) {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        }

        // মাইনিং ফাংশন
        function startMining() {
            const currentTime = new Date().getTime();
            if (currentTime - lastMiningTime >= miningCooldown) {
                const miningButton = document.getElementById("mining-button");
                miningButton.innerText = "মাইনিং চলছে...";
                miningButton.disabled = true;

                setTimeout(() => {
                    userPoints += 50;
                    lastMiningTime = new Date().getTime();
                    localStorage.setItem("userPoints", userPoints);
                    localStorage.setItem("lastMiningTime", lastMiningTime);
                    document.getElementById("points").innerText = userPoints;
                    miningButton.innerText = "মাইনিং";
                    updateMiningStatus();
                }, 3000); // ৩ সেকেন্ড সিমুলেশন
            } else {
                alert("আপনি ২৪ ঘণ্টা পর আবার মাইনিং করতে পারবেন!");
            }
        }

        // মাইনিং স্ট্যাটাস আপডেট করা
        function updateMiningStatus() {
            const currentTime = new Date().getTime();
            const timeSinceLastMining = currentTime - lastMiningTime;
            const miningButton = document.getElementById("mining-button");
            const statusText = document.getElementById("status-text");

            if (timeSinceLastMining >= miningCooldown) {
                miningButton.disabled = false;
                statusText.innerText = "প্রস্তুত";
            } else {
                miningButton.disabled = true;
                const timeLeft = Math.ceil((miningCooldown - timeSinceLastMining) / (1000 * 60 * 60)); // ঘণ্টায় বাকি সময়
                statusText.innerText = `অপেক্ষা করুন (${timeLeft} ঘণ্টা বাকি)`;
            }
        }

        // প্রতি সেকেন্ডে স্ট্যাটাস আপডেট করা (টাইমারের জন্য)
        setInterval(updateMiningStatus, 1000);
    </script>
</body>
</html>

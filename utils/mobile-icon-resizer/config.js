var config = {
  iOS: {
    "images": [
      {
        "size" : "29x29",
        "idiom" : "universal-settings",
        "filename" : "-Small.png",
        "scale" : "1x"
      },
      {
        "size" : "29x29",
        "idiom" : "universal-settings",
        "filename" : "-Small@2x.png",
        "scale" : "2x"
      },
      {
        "size" : "29x29",
        "idiom" : "universal-settings",
        "filename" : "-Small@3x.png",
        "scale" : "3x"
      },
      {
        "size" : "40x40",
        "idiom" : "universal-spotlight",
        "filename" : "-Small-40.png",
        "scale" : "1x"
      },
      {
        "size" : "40x40",
        "idiom" : "universal-spotlight",
        "filename" : "-Small-40@2x.png",
        "scale" : "2x"
      },
      {
        "size" : "40x40",
        "idiom" : "universal-spotlight",
        "filename" : "-Small-40@3x.png",
        "scale" : "3x"
      },
      {
        "size" : "76x76",
        "idiom" : "ipad",
        "filename" : "-76.png",
        "scale" : "1x"
      },
      {
        "size" : "76x76",
        "idiom" : "ipad",
        "filename" : "-76@2x.png",
        "scale" : "2x"
      },
      {
        "size" : "83.5x83.5",
        "idiom" : "ipad-pro",
        "filename" : "-83.5@2x.png",
        "scale" : "2x"
      },
      {
        "size" : "60x60",
        "idiom" : "iphone",
        "filename" : "-60@2x.png",
        "scale" : "2x"
      },
      {
        "size" : "60x60",
        "idiom" : "iphone",
        "filename" : "-60@3x.png",
        "scale" : "3x"
      }
    ]
  },
  android: {
    "images" : [
      {
        "baseRatio" : "3/4",
        "folder" : "drawable-ldpi"
      },
      {
        "baseRatio" : "1",
        "folder" : "drawable-mdpi"
      },
      {
        "baseRatio" : "4/3",
        "folder" : "drawable-tvdpi"
      },
      {
        "baseRatio" : "1.5",
        "folder" : "drawable-hdpi"
      },
      {
        "baseRatio" : "2",
        "folder" : "drawable-xhdpi"
      },
      {
        "baseRatio" : "3",
        "folder" : "drawable-xxhdpi"
      },
      {
        "baseRatio" : "4",
        "folder" : "drawable-xxxhdpi"
      },
      {
        // Image to upload to the Play Store
        "size": "512x512",
        "folder" : "WEB"
      }
    ]
  }
};

exports = module.exports = config;

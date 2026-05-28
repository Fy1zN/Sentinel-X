from app.services.ioc_classifier import detect_ioc_type


samples = [

    "8.8.8.8",

    "google.com",

    "https://malicious-site.ru/login",

    "attacker@gmail.com",

    "44d88612fea8a8f36de82e1278abb02f",

    "a94a8fe5ccb19ba61c4c0873d391e987982fbbd",

    "852aa6e9d0b7cdf9298edc7e8065c861ae60706429e8b76091d3ac05dfe548f5",

]


for item in samples:

    result = detect_ioc_type(item)

    print(f"{item} --> {result}")
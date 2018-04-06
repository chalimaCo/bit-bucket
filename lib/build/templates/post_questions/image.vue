form(v-for="question, key in questions", :key="question")
    .row
        .col-8
            label(:for="'#content' + key") Content
            textarea(name="content", :id="'#content' + key" rows="1")
        .col-4
            label(:for="'#answer' + key") Answer
            input(type="text", name="content", pattern="^[abcd]$", :id="'#answer' + key")
    hr
    h2 Options
    .row
        .col-6
            label(:for="'#answer' + key") A
            input(type="text", name="A", :id="'#A' + key")
        .col-6
        label(:for="'#answer' + key") B
            input(type="text", name="B", :id="'#B' + key")
        .col-6
        label(:for="'#answer' + key") C
            input(type="text", name="C", :id="'#C' + key")
        .col-6
        label(:for="'#answer' + key") D
            input(type="text", name="D", :id="'#D' + key")
    label(:for="'#image' + key") Image
        input.form-control-file(type="file", :id="'#image' key" accept="image/*" name="image")
const sanitizeHtml = require('sanitize-html');
const format = require('html-format');
const fs = require('fs-extra');
const path = require('path')




function tidy_article(input_path, output_path, remove_reply) {
	const input_html = fs.readFileSync(input_path, 'utf8');
	// console.log(input_html);
	const sanitizeOption = {
		allowedTags: [
			"address", "article", "aside", "footer", "header", "h1", "h2", "h3", "h4",
			"h5", "h6", "hgroup", "main", "nav", "section", "blockquote", "dd", "div",
			"dl", "dt", "figcaption", "figure", "hr", "li", "main", "ol", "p", "pre",
			"ul", "a", "abbr", "b", "bdi", "bdo", "br", "cite", "code", "data", "dfn",
			"em", "i", "kbd", "mark", "q", "rb", "rp", "rt", "rtc", "ruby", "s", "samp",
			"small", "span", "strong", "sub", "sup", "time", "u", "var", "caption",
			"col", "colgroup", "table", "tbody", "td", "tfoot", "th", "thead", "tr",
			"img", "title", "fieldset"
		],
		allowedAttributes: {
			p: ['align'],
			a: ['href', 'name', 'target'],
			img: ['src', 'srcset', 'alt', 'title', 'width', 'height', 'loading']
		},
		exclusiveFilter: function(frame) {
			const isNotLocalImage = frame.tag === 'img' && frame.attribs.src && !frame.attribs.src.startsWith("..");
			const isLink = frame.tag === 'a';
			const isReply = frame.tag === 'div' && frame.attribs.id && frame.attribs.id === 'divReply';
			const isUnwatedText1 = frame.tag === 'p' && frame.text === "浏览“缠中说禅”更多文章请点击进入";
			const isUnwatedText2 = frame.tag === 'div' && frame.text === "资料整理:Lipton .腾讯微博:@LiptonMilkTea";
			const isUnwatedText3 = frame.tag === 'div' && frame.text.endsWith("更多文章请点击进入");
			const isUnwatedText4 = frame.tag === 'div' && frame.text.endsWith(" 只显示缠师回复 ");
			 
			const isEmptyDiv = frame.tag === 'div' && !frame.text.trim();
			return isNotLocalImage || isLink || isUnwatedText1 || isUnwatedText2 || isUnwatedText3 ||isUnwatedText4|| isEmptyDiv || (remove_reply && isReply);
		},
		transformTags: (!remove_reply && {
			'div': 'p'
		})
	};

	const cleaned_html = sanitizeHtml(input_html, sanitizeOption);
	const format_html = format(cleaned_html);
	// console.log(format_html);
	fs.writeFileSync(output_path, format_html);
}

function tidy_all_files(input_dir,output_dir){
    fs.readdirSync(input_dir).forEach(function (dir_name) {
        var path_name = path.join(input_dir, dir_name);
        if (fs.statSync(path_name).isDirectory()) {
            fs.readdirSync(path_name).forEach(function (file) {
				if(file.endsWith(".html")||file.endsWith(".htm")){
					const input_path= path.join(path_name, file);
					const output_sub_dir=path.join(output_dir, dir_name);
					const output_path=path.join(output_sub_dir,file);
					console.log(input_path,"==>",output_path)
					fs.ensureDirSync(output_sub_dir);
					tidy_article(input_path,output_path,false);
				}
            });
        } 
    });
}

function test_tidy_article(){
	let input_filename = "526.html"
	const input_dir = path.join(__dirname, "..", "raw","sina_blog", "chan_fenlei", "jiaonichaogupiao")
	const input_path = path.join(input_dir, input_filename);
	const output_dir = path.join(__dirname, "..", "tidy","sina_blog", "chan_fenlei", "jiaonichaogupiao");
	const output_path = path.join(output_dir, input_filename);
	fs.ensureDirSync(output_dir)
	tidy_article(input_path,output_path,false)
}
// test_tidy_article();

function test_tidy_article2(){
	let input_filename = "1.html"
	const input_dir = path.join(__dirname, "..", "raw","sina_blog", "chan_time", "2006_01_06")
	const input_path = path.join(input_dir, input_filename);
	const output_dir = path.join(__dirname, "..", "tidy","sina_blog", "chan_time", "2006_01_06");
	const output_path = path.join(output_dir, input_filename);
	fs.ensureDirSync(output_dir)
	tidy_article(input_path,output_path,false)
}
 // test_tidy_article2();

function tidy_all_files_fenlei(){
	const input_dir = path.join(__dirname, "..", "raw","sina_blog", "chan_fenlei")
	const output_dir = path.join(__dirname, "..", "tidy","sina_blog", "chan_fenlei");

	tidy_all_files(input_dir,output_dir)
}
// tidy_all_files_fenlei()

function tidy_all_files_time(){
	const input_dir = path.join(__dirname, "..", "raw","sina_blog", "chan_time")
	const output_dir = path.join(__dirname, "..", "tidy","sina_blog", "chan_time");

	tidy_all_files(input_dir,output_dir)
}
tidy_all_files_time()
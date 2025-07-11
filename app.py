from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("form.html")


@app.route("/submit", methods=["POST"])
def submit():
    data = request.json
    with open("submissions.txt", "a") as f:
        f.write(str(data) + "\n")
    return jsonify({"status": "ok", "message": "Submission saved"})


if __name__ == "__main__":
    app.run(debug=True)
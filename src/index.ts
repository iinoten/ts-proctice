class HitAndBlow {
    private readonly answerSource = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    private answer: string[] = [] // 空配列のみだと中身に対しての型推論が働かないので型アノテーションが必要
    private tryCount = 0

    setting() {
        const answerLength = 3
        while (this.answer.length < answerLength) {
            const randNum = Math.floor(Math.random() * this.answerSource.length)
            const selectedItem = this.answerSource[randNum]
            if(!this.answer.includes(selectedItem)) {
                this.answer.push(selectedItem)
            }
        }
    }

    async play() {
        const inputArr = (await promptInput('「,」区切りで3つの数字を入力してください')).split(',')
        const result = this.check(inputArr)

        if (result.hit !== this.answer.length) {
            //不正解だったら続ける
            printLine(`---\nHit: ${result.hit}\nBlow: ${result.blow}\n---`)
            this.tryCount += 1
            await this.play()
        } else {
            // 正解だったら終了
            this.tryCount += 1
        }
    }

    private check(input: string[]) {
        let hitCount = 0
        let blowCount = 0

        input.forEach((val, index) => {
            if (val === this.answer[index]) {
                hitCount += 1
            } else if (this.answer.includes(val)) {
                blowCount += 1
            }
        })

        return {
            hit: hitCount,
            blow: blowCount,
        }
    }

    end() {
        printLine(`正解です！ \n試行回数: ${this.tryCount}回`)
        process.exit()
    }
}

const printLine = (text: string, breakLine: boolean = true) => {
    process.stdout.write(text + (breakLine ? '\n' : ''))
}

const promptInput = async (text: string) => {
    printLine(`\n${text}`, false)
    const input: string = await new Promise((resolve) => process.stdin.once(
        'data', (data) => resolve(data.toString())
    ))
    return input.trim()
}

;(async () => {
    const hitAndBlow = new HitAndBlow()
    hitAndBlow.setting()
    await hitAndBlow.play()
    hitAndBlow.end()
})()




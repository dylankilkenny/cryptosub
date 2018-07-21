import sys
sys.path.append('../')
# from WordFreq import WordFreq
from mockdf import MockDF

comments = MockDF()
posts = MockDF()
word_freq = WordFreq(comments.getDataframe(), posts.getDataframe())  

def test_currency_mentions():
    wf = word_freq.getWordFreq(None)
    assert isinstance(wf, list)
    assert len(wf) <= 500
    assert len(wf) > 0
    assert "word" in wf[0]
    assert "n_comment" in wf[0]
    assert "n_post" in wf[0]
    assert "n" in wf[0]